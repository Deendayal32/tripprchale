import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET() {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT slug, label, emoji FROM categories ORDER BY sort_order ASC, label ASC'
    )
    return NextResponse.json({ categories: rows })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
