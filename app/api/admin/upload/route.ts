import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const filename = `trip-${Date.now()}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error('[POST /api/admin/upload]', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
