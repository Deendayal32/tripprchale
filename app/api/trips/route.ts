import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const month    = searchParams.get('month')    || 'all'
    const search   = searchParams.get('search')   || ''

    // ── Build trips query ───────────────────────────────────
    let tripsQuery = 'SELECT * FROM trips WHERE 1=1'
    const params: (string | number)[] = []

    if (category !== 'all') {
      tripsQuery += ' AND category = ?'
      params.push(category)
    }

    if (month !== 'all') {
      tripsQuery += ` AND EXISTS (
        SELECT 1 FROM batches b
        WHERE b.trip_id = trips.id
        AND DATE_FORMAT(b.departure_date, '%Y-%m') = ?
      )`
      params.push(month)
    }

    if (search.trim()) {
      tripsQuery += ' AND (name LIKE ? OR destination LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    tripsQuery += ' ORDER BY price ASC'

    const [trips] = await pool.execute<RowDataPacket[]>(tripsQuery, params)

    if (trips.length === 0) {
      return NextResponse.json({ trips: [] })
    }

    // ── Fetch batches for these trips ───────────────────────
    const tripIds = trips.map((t) => t.id)
    const placeholders = tripIds.map(() => '?').join(',')
    const [batches] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM batches WHERE trip_id IN (${placeholders}) ORDER BY departure_date ASC`,
      tripIds
    )

    // ── Join + parse JSON fields ────────────────────────────
    const result = (trips as RowDataPacket[]).map((t: RowDataPacket) => ({
      id:             t.id,
      name:           t.name,
      destination:    t.destination,
      category:       t.category,
      price:          t.price,
      originalPrice:  t.originalPrice,
      totalSeats:     t.totalSeats,
      seatsLeft:      t.seatsLeft,
      image:          t.image,
      emoji:          t.emoji,
      badge:          t.badge,
      badgeColor:     t.badgeColor,
      difficulty:     t.difficulty,
      duration:       t.duration,
      durationBadge:  t.duration,
      highlights:     typeof t.highlights === 'string' ? JSON.parse(t.highlights) : (t.highlights ?? []),
      includes:       typeof t.includes   === 'string' ? JSON.parse(t.includes)   : (t.includes   ?? []),
      batches: (batches as RowDataPacket[])
        .filter((b: RowDataPacket) => b.trip_id === t.id)
        .map((b: RowDataPacket) => ({
          batchId:       b.batch_code,
          departureDate: b.departure_date instanceof Date
            ? b.departure_date.toISOString().split('T')[0]
            : String(b.departure_date).split('T')[0],
          seatsLeft: b.seats_left,
          status:    b.status,
        })),
    }))

    return NextResponse.json({ trips: result })
  } catch (err) {
    console.error('[GET /api/trips]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
