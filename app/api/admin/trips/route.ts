import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name, destination, category, price, originalPrice,
      totalSeats, seatsLeft, image, emoji, badge, badgeColor,
      difficulty, duration, tagline,
      highlights, includes, exclusions,
      quad_price, triple_price, double_price, advance_amount,
      itinerary, cancellation_policy, trip_terms,
      batches = [],
    } = body

    if (!name || !destination || !price || !duration) {
      return NextResponse.json({ error: 'name, destination, price and duration are required' }, { status: 400 })
    }

    const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const slug = `${baseSlug}-${Date.now()}`

    // Discover all NOT-NULL columns without defaults so we never miss one
    const [colRows] = await pool.execute(
      `SELECT COLUMN_NAME, COLUMN_DEFAULT, IS_NULLABLE
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'trips'
       AND IS_NULLABLE = 'NO' AND COLUMN_DEFAULT IS NULL
       AND EXTRA NOT LIKE '%auto_increment%'`
    ) as [{ COLUMN_NAME: string }[], unknown]
    const requiredCols = (colRows as { COLUMN_NAME: string }[]).map(r => r.COLUMN_NAME)

    // Build values map – covers every known column + empty-string fallback for unknowns
    const valuesMap: Record<string, unknown> = {
      slug,
      name,
      destination,
      category:      category      ?? 'weekend',
      price,
      originalPrice: originalPrice ?? null,
      totalSeats:    totalSeats    ?? 20,
      seatsLeft:     seatsLeft     ?? totalSeats ?? 20,
      image:         image         ?? '',
      emoji:         emoji         ?? '✈️',
      badge:         badge         ?? '',
      badgeColor:    badgeColor    ?? '#FF914D',
      difficulty:    difficulty    ?? 'Easy',
      duration,
      tagline:       tagline       ?? '',
      highlights:          highlights          ?? '[]',
      includes:            includes            ?? '[]',
      exclusions:          exclusions          ?? '[]',
      quad_price:          quad_price          ?? null,
      triple_price:        triple_price        ?? null,
      double_price:        double_price        ?? null,
      advance_amount:      advance_amount      ?? 2000,
      itinerary:           itinerary           ?? '[]',
      cancellation_policy: cancellation_policy ?? '',
      trip_terms:          trip_terms          ?? '',
    }

    // Auto-add any required column we don't explicitly know about
    for (const col of requiredCols) {
      if (!(col in valuesMap)) valuesMap[col] = ''
    }

    const cols = Object.keys(valuesMap)
    const vals = Object.values(valuesMap) as (string | number | null)[]
    const placeholders = cols.map(() => '?').join(',')

    // Insert trip
    const [result] = await pool.execute(
      `INSERT INTO trips (${cols.join(',')}) VALUES (${placeholders})`,
      vals
    )

    const tripId = (result as { insertId: number }).insertId

    // Insert batches
    for (const b of batches) {
      if (!b.departureDate) continue
      const batchCode = `${name.replace(/\s+/g, '-').toLowerCase()}-${b.departureDate}`
      await pool.execute(
        `INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status)
         VALUES (?,?,?,?,?)`,
        [tripId, batchCode, b.departureDate, b.seatsLeft ?? 20, b.status ?? 'Available']
      )
    }

    return NextResponse.json({ success: true, id: tripId }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/trips]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

// List all trips – supports ?search= and ?category=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search   = searchParams.get('search')   || ''
    const category = searchParams.get('category') || ''

    let q = 'SELECT id, name, destination, category, price, seatsLeft, totalSeats, badge, badgeColor, emoji, duration FROM trips WHERE 1=1'
    const params: (string | number)[] = []

    if (category && category !== 'all') { q += ' AND category = ?'; params.push(category) }
    if (search.trim()) { q += ' AND (name LIKE ? OR destination LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }

    q += ' ORDER BY id DESC LIMIT 50'
    const [rows] = await pool.execute(q, params)
    return NextResponse.json({ trips: rows })
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
