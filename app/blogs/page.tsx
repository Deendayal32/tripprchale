import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Our Blogs – TripprChale',
  description: 'Travel stories, tips, and adventures from the TripprChale community.',
}

export default function BlogsPage() {
  return (
    <>
      <Navbar />

      <main style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
        {/* Hero */}
        <div style={{ background: 'var(--navy)' }} className="py-14 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Our Blogs</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">Travel stories, tips &amp; adventures</p>
        </div>

        {/* Coming Soon */}
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="text-7xl mb-6">✍️</div>
          <h2 className="font-black text-3xl sm:text-4xl mb-3" style={{ color: 'var(--navy)' }}>
            Coming Soon!
          </h2>
          <p className="text-sm leading-relaxed max-w-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            We&apos;re crafting travel stories, destination guides, and trip tips for you. Our blog
            goes live very soon — follow us on Instagram to stay updated!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/"
              className="btn-primary text-sm px-6 py-3">
              ← Back to Trips
            </Link>
            <a href="https://www.instagram.com/tripprchale?igsh=OWV1czhwYThvZW11&utm_source=qr"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-all hover:scale-105"
              style={{ background: '#E1306C', color: '#fff' }}>
              📸 Follow on Instagram
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
