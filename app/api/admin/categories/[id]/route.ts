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
    await pool.execute('DELETE FROM categories WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
