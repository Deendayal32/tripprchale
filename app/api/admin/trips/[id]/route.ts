import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { cookies } from 'next/headers'

async function isAuthed() {
  const jar = await cookies()
  return !!jar.get('admin_token')?.value
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await pool.execute('DELETE FROM batches WHERE trip_id = ?', [id])
    await pool.execute('DELETE FROM trips WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/trips/:id]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body    = await req.json()

  const fields = Object.entries(body)
    .filter(([, v]) => v !== undefined)
    .map(([k]) => `${k} = ?`)
    .join(', ')
  const values: (string | number | null)[] = (Object.values(body) as (string | number | null)[]).filter(v => v !== undefined)

  if (!fields) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

  try {
    await pool.execute(`UPDATE trips SET ${fields} WHERE id = ?`, [...values, id] as (string | number | null)[])
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
