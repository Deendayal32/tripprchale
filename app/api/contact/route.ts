import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, travellers, destination, date, message } = await req.json()

    if (!name?.trim() || !phone?.trim())
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })

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
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
