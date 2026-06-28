import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { cookies } from 'next/headers'
import { RowDataPacket } from 'mysql2'

async function isAuthed() {
  const jar = await cookies()
  return !!jar.get('admin_token')?.value
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const [trips] = await pool.execute<RowDataPacket[]>('SELECT * FROM trips WHERE id = ?', [id])
    if (trips.length === 0) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })

    const t = trips[0]
    const [batches] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM batches WHERE trip_id = ? ORDER BY departure_date ASC',
      [id]
    )

    const trip = {
      id:                  t.id,
      name:                t.name,
      destination:         t.destination,
      category:            t.category,
      price:               t.price,
      originalPrice:       t.originalPrice,
      totalSeats:          t.totalSeats,
      seatsLeft:           t.seatsLeft,
      image:               t.image,
      emoji:               t.emoji,
      badge:               t.badge,
      badgeColor:          t.badgeColor,
      difficulty:          t.difficulty,
      duration:            t.duration,
      tagline:             t.tagline ?? '',
      highlights:          typeof t.highlights === 'string' ? JSON.parse(t.highlights) : (t.highlights ?? []),
      includes:            typeof t.includes   === 'string' ? JSON.parse(t.includes)   : (t.includes   ?? []),
      excludes:            typeof t.excludes   === 'string' ? JSON.parse(t.excludes)   : (t.excludes   ?? []),
      quad_price:          t.quad_price,
      triple_price:        t.triple_price,
      double_price:        t.double_price,
      advance_amount:      t.advance_amount,
      itinerary:           typeof t.itinerary === 'string' ? JSON.parse(t.itinerary) : (t.itinerary ?? []),
      cancellation_policy: t.cancellation_policy ?? '',
      trip_terms:          t.trip_terms ?? '',
      batches: (batches as RowDataPacket[]).map(b => ({
        departureDate: b.departure_date instanceof Date
          ? b.departure_date.toISOString().split('T')[0]
          : String(b.departure_date).split('T')[0],
        seatsLeft: b.seats_left,
        status:    b.status,
      })),
    }

    return NextResponse.json({ trip })
  } catch (err) {
    console.error('[GET /api/admin/trips/:id]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
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
  const body   = await req.json()

  const { batches, ...tripFields } = body

  const fields = Object.entries(tripFields)
    .filter(([, v]) => v !== undefined)
    .map(([k]) => `${k} = ?`)
    .join(', ')
  const values: (string | number | null)[] = (Object.values(tripFields) as (string | number | null)[]).filter(v => v !== undefined)

  if (!fields) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

  try {
    await pool.execute(`UPDATE trips SET ${fields} WHERE id = ?`, [...values, id] as (string | number | null)[])

    if (Array.isArray(batches)) {
      await pool.execute('DELETE FROM batches WHERE trip_id = ?', [id])
      const [tripRows] = await pool.execute<RowDataPacket[]>('SELECT name FROM trips WHERE id = ?', [id])
      const tripName   = (tripRows[0]?.name as string) ?? 'trip'
      for (const b of batches as { departureDate?: string; seatsLeft?: number; status?: string }[]) {
        if (!b.departureDate) continue
        const batchCode = `${tripName.replace(/\s+/g, '-').toLowerCase()}-${b.departureDate}`
        await pool.execute(
          'INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES (?,?,?,?,?)',
          [id, batchCode, b.departureDate, b.seatsLeft ?? 20, b.status ?? 'Available']
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/admin/trips/:id]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
