import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Lazily discovered column list — cached per process
let _hasExtraColumns: boolean | null = null

async function hasExtraColumns(): Promise<boolean> {
  if (_hasExtraColumns !== null) return _hasExtraColumns
  try {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contacts'
       AND COLUMN_NAME = 'travellers'`
    ) as [{ cnt: number }[], unknown]
    _hasExtraColumns = rows[0].cnt > 0
  } catch {
    _hasExtraColumns = false
  }
  return _hasExtraColumns
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, travellers, destination, date, message } = await req.json()

    if (!name?.trim() || !phone?.trim())
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })

    const extraCols = await hasExtraColumns()

    if (extraCols) {
      await pool.execute(
        `INSERT INTO contacts (name, email, phone, travellers, destination, date, message)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name.trim(),
          email?.trim()       || '',
          phone.trim(),
          travellers?.trim()  || '1',
          destination?.trim() || '',
          date?.trim()        || '',
          message?.trim()     || '',
        ]
      )
    } else {
      // Old schema — pack extras into message so nothing is lost
      const extra = [
        destination?.trim() && `Destination: ${destination.trim()}`,
        travellers?.trim()  && `Travelers: ${travellers.trim()}`,
        date?.trim()        && `Date: ${date.trim()}`,
      ].filter(Boolean).join(' | ')

      const fullMessage = [message?.trim(), extra].filter(Boolean).join('\n') || ''

      await pool.execute(
        `INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)`,
        [name.trim(), email?.trim() || '', phone.trim(), fullMessage]
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
