import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { cookies } from 'next/headers'

async function isAuthed() {
  const jar = await cookies()
  return !!jar.get('admin_token')?.value
}

export async function POST(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()

    const {
      name, destination, category, price, originalPrice,
      totalSeats, seatsLeft, image, images, emoji, badge, badgeColor,
      difficulty, duration, tagline,
      highlights, includes, excludes,
      quad_price, triple_price, double_price, advance_amount,
      itinerary, cancellation_policy, trip_terms,
      country,
      batches = [],
    } = body

    if (!name || !destination || !price || !duration) {
      return NextResponse.json({ error: 'name, destination, price and duration are required' }, { status: 400 })
    }

    const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const slug = `${baseSlug}-${Date.now()}`

    // Derive startDate / endDate from batches (handles old DB schemas that have these columns)
    const sortedDates = (batches as { departureDate?: string }[])
      .map(b => b.departureDate)
      .filter((d): d is string => !!d)
      .sort()
    const firstBatchDate = sortedDates[0] ?? new Date().toISOString().split('T')[0]
    const lastBatchDate  = sortedDates[sortedDates.length - 1] ?? firstBatchDate

    // Discover columns in the live DB so we handle any schema variation
    const [colRows] = await pool.execute(
      `SELECT COLUMN_NAME, DATA_TYPE
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'trips'
       AND IS_NULLABLE = 'NO' AND COLUMN_DEFAULT IS NULL
       AND EXTRA NOT LIKE '%auto_increment%'`
    ) as [{ COLUMN_NAME: string; DATA_TYPE: string }[], unknown]

    // Known values map — covers every column we actively manage
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
      images:        images        ?? '[]',
      emoji:         emoji         ?? '✈️',
      badge:         badge         ?? '',
      badgeColor:    badgeColor    ?? '#FF914D',
      difficulty:    difficulty    ?? 'Easy',
      duration,
      tagline:       tagline       ?? '',
      highlights:          highlights          ?? '[]',
      includes:            includes            ?? '[]',
      excludes:          excludes          ?? '[]',
      quad_price:          quad_price          ?? null,
      triple_price:        triple_price        ?? null,
      double_price:        double_price        ?? null,
      advance_amount:      advance_amount      ?? 2000,
      itinerary:           itinerary           ?? '[]',
      cancellation_policy: cancellation_policy ?? '',
      trip_terms:          trip_terms          ?? '',
      // Legacy columns present in some Hostinger DB versions
      country:   country    ?? '',
      startDate: firstBatchDate,
      endDate:   lastBatchDate,
    }

    // Auto-fill any other required column we don't explicitly know about,
    // using a type-appropriate default so DATE/INT columns don't get ''
    const DATE_TYPES = new Set(['date', 'datetime', 'timestamp'])
    const INT_TYPES  = new Set(['int', 'tinyint', 'smallint', 'mediumint', 'bigint'])

    for (const { COLUMN_NAME, DATA_TYPE } of colRows as { COLUMN_NAME: string; DATA_TYPE: string }[]) {
      if (COLUMN_NAME in valuesMap) continue
      const t = DATA_TYPE.toLowerCase()
      if (DATE_TYPES.has(t))      valuesMap[COLUMN_NAME] = new Date().toISOString().split('T')[0]
      else if (INT_TYPES.has(t))  valuesMap[COLUMN_NAME] = 0
      else                        valuesMap[COLUMN_NAME] = ''
    }

    const cols         = Object.keys(valuesMap)
    const vals         = Object.values(valuesMap) as (string | number | null)[]
    const placeholders = cols.map(() => '?').join(',')

    const [result] = await pool.execute(
      `INSERT INTO trips (${cols.join(',')}) VALUES (${placeholders})`,
      vals
    )

    const tripId = (result as { insertId: number }).insertId

    for (const b of batches as { departureDate?: string; seatsLeft?: number; status?: string }[]) {
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

// List trips — used by admin search dropdown and admin list page
export async function GET(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const search   = searchParams.get('search')   || ''
    const category = searchParams.get('category') || ''

    let q = `SELECT id, slug, name, destination, category, price,
                    seatsLeft, totalSeats, badge, badgeColor, emoji, duration
             FROM trips WHERE 1=1`
    const params: (string | number)[] = []

    if (category && category !== 'all') { q += ' AND category = ?'; params.push(category) }
    if (search.trim()) { q += ' AND (name LIKE ? OR destination LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }

    q += ' ORDER BY id DESC LIMIT 50'
    const [rows] = await pool.execute(q, params)
    return NextResponse.json({ trips: rows })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
