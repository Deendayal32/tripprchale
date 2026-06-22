import pool from './db'
import { RowDataPacket } from 'mysql2'

export type Batch = {
  batchId: string
  departureDate: string
  seatsLeft: number
  status: 'Available' | 'Filling Fast' | 'Last Few Seats'
}

export type Trip = {
  id: number
  name: string
  destination: string
  category: string
  price: number
  originalPrice?: number
  totalSeats: number
  seatsLeft: number
  image: string
  emoji: string
  badge: string
  badgeColor: string
  difficulty: string
  duration: string
  durationBadge: string
  highlights: string[]
  includes: string[]
  batches: Batch[]
}

// ── Shared row → Trip mapper ────────────────────────────────
function mapRow(t: RowDataPacket, batches: RowDataPacket[]): Trip {
  return {
    id:            t.id,
    name:          t.name,
    destination:   t.destination,
    category:      t.category,
    price:         t.price,
    originalPrice: t.originalPrice ?? undefined,
    totalSeats:    t.totalSeats,
    seatsLeft:     t.seatsLeft,
    image:         t.image ?? '',
    emoji:         t.emoji ?? '✈️',
    badge:         t.badge ?? '',
    badgeColor:    t.badgeColor ?? '#FF914D',
    difficulty:    t.difficulty ?? 'Easy',
    duration:      t.duration ?? '',
    durationBadge: t.duration ?? '',
    highlights:    typeof t.highlights === 'string' ? JSON.parse(t.highlights) : (t.highlights ?? []),
    includes:      typeof t.includes   === 'string' ? JSON.parse(t.includes)   : (t.includes   ?? []),
    batches: batches
      .filter(b => b.trip_id === t.id)
      .map(b => ({
        batchId:       b.batch_code ?? '',
        departureDate: b.departure_date instanceof Date
          ? b.departure_date.toISOString().split('T')[0]
          : String(b.departure_date).split('T')[0],
        seatsLeft: b.seats_left,
        status:    b.status,
      })),
  }
}

// ── Fetch all trips (with optional filters) ─────────────────
export async function getTrips(
  category = 'all',
  month    = 'all',
  search   = ''
): Promise<Trip[]> {
  let query = 'SELECT * FROM trips WHERE 1=1'
  const params: (string | number)[] = []

  if (category !== 'all') {
    query += ' AND category = ?'
    params.push(category)
  }

  if (month !== 'all') {
    query += ` AND EXISTS (
      SELECT 1 FROM batches b
      WHERE b.trip_id = trips.id
      AND DATE_FORMAT(b.departure_date, '%Y-%m') = ?
    )`
    params.push(month)
  }

  if (search.trim()) {
    query += ' AND (name LIKE ? OR destination LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }

  query += ' ORDER BY price ASC'

  const [rows] = await pool.execute<RowDataPacket[]>(query, params)
  if (rows.length === 0) return []

  const ids = rows.map(r => r.id)
  const [batches] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM batches WHERE trip_id IN (${ids.map(() => '?').join(',')}) ORDER BY departure_date ASC`,
    ids
  )

  return rows.map(r => mapRow(r, batches as RowDataPacket[]))
}

// ── Fetch single trip by id ─────────────────────────────────
export async function getTripById(id: string | number): Promise<Trip | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM trips WHERE id = ?',
    [id]
  )
  if (rows.length === 0) return null

  const [batches] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM batches WHERE trip_id = ? ORDER BY departure_date ASC',
    [id]
  )

  return mapRow(rows[0], batches as RowDataPacket[])
}
