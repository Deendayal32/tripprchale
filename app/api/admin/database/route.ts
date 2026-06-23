import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { cookies } from 'next/headers'

async function isAuthed() {
  const jar = await cookies()
  return !!jar.get('admin_token')?.value
}

export async function POST(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const sql: string = body?.sql ?? ''

  if (!sql.trim()) {
    return NextResponse.json({ error: 'No SQL provided' }, { status: 400 })
  }

  // Split on semicolons; drop blank lines and pure comment lines
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  type StmtResult = {
    statement: string
    success: boolean
    affectedRows?: number
    rows?: unknown[]
    error?: string
  }

  const results: StmtResult[] = []

  for (const stmt of statements) {
    try {
      const [raw] = await pool.execute(stmt)
      const r = raw as unknown as Record<string, unknown>
      results.push({
        statement: stmt.length > 120 ? stmt.slice(0, 120) + '…' : stmt,
        success: true,
        affectedRows: typeof r.affectedRows === 'number' ? r.affectedRows : undefined,
        rows: Array.isArray(raw) ? (raw as unknown[]).slice(0, 50) : undefined,
      })
    } catch (err: unknown) {
      results.push({
        statement: stmt.length > 120 ? stmt.slice(0, 120) + '…' : stmt,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  const allOk = results.every(r => r.success)
  return NextResponse.json({ success: allOk, results }, { status: allOk ? 200 : 207 })
}
