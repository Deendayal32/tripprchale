import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { cookies } from 'next/headers'
import { RowDataPacket } from 'mysql2'

async function isAuthed() {
  const jar = await cookies()
  return !!jar.get('admin_token')?.value
}

export async function GET() {
  if (!await isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT c.id, c.slug, c.label, c.emoji, c.sort_order,
              COUNT(t.id) AS trip_count
       FROM categories c
       LEFT JOIN trips t ON t.category = c.slug
       GROUP BY c.id
       ORDER BY c.sort_order ASC, c.label ASC`
    )
    return NextResponse.json({ categories: rows })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { label, emoji, slug } = await req.json()
    if (!label?.trim() || !slug?.trim())
      return NextResponse.json({ error: 'label and slug are required' }, { status: 400 })

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

    const [[{ maxOrder }]] = await pool.execute<RowDataPacket[]>(
      'SELECT COALESCE(MAX(sort_order),0) AS maxOrder FROM categories'
    ) as [RowDataPacket[], unknown]

    await pool.execute(
      'INSERT INTO categories (slug, label, emoji, sort_order) VALUES (?,?,?,?)',
      [cleanSlug, label.trim(), emoji?.trim() || '🗺️', Number(maxOrder) + 1]
    )
    return NextResponse.json({ success: true, slug: cleanSlug }, { status: 201 })
  } catch (err: unknown) {
    const msg = String(err)
    if (msg.includes('Duplicate entry'))
      return NextResponse.json({ error: 'A category with that slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
