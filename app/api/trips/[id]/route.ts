import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [trips] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM trips WHERE id = ?',
      [id]
    )

    if (trips.length === 0) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    const t = trips[0]

    const [batches] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM batches WHERE trip_id = ? ORDER BY departure_date ASC',
      [id]
    )

    const trip = {
      id:            t.id,
      name:          t.name,
      destination:   t.destination,
      category:      t.category,
      price:         t.price,
      originalPrice: t.originalPrice,
      totalSeats:    t.totalSeats,
      seatsLeft:     t.seatsLeft,
      image:         t.image,
      emoji:         t.emoji,
      badge:         t.badge,
      badgeColor:    t.badgeColor,
      difficulty:    t.difficulty,
      duration:      t.duration,
      durationBadge: t.duration,
      highlights:    typeof t.highlights === 'string' ? JSON.parse(t.highlights) : (t.highlights ?? []),
      includes:      typeof t.includes   === 'string' ? JSON.parse(t.includes)   : (t.includes   ?? []),
      batches: (batches as RowDataPacket[]).map((b) => ({
        batchId:       b.batch_code,
        departureDate: b.departure_date instanceof Date
          ? b.departure_date.toISOString().split('T')[0]
          : String(b.departure_date).split('T')[0],
        seatsLeft: b.seats_left,
        status:    b.status,
      })),
    }

    return NextResponse.json({ trip })
  } catch (err) {
    console.error('[GET /api/trips/:id]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
