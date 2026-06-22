import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export const revalidate = 60 // cache for 60s

export async function GET() {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT category, COUNT(*) as count FROM trips GROUP BY category ORDER BY category'
    )
    return NextResponse.json({ counts: rows.map(r => ({ category: r.category, count: Number(r.count) })) })
  } catch (err) {
    console.error('[GET /api/trips/counts]', err)
    return NextResponse.json({ counts: [] })
  }
}
