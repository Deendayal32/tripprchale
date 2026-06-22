import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const validUser = process.env.ADMIN_USERNAME ?? 'admin'
  const validPass = process.env.ADMIN_PASSWORD ?? 'Admin@1234'
  const secret    = process.env.ADMIN_SECRET   ?? 'tripprchale_secret'

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = Buffer.from(`${secret}:${Date.now()}`).toString('base64')

  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 8, // 8 hours
    path:     '/',
  })
  return res
}
