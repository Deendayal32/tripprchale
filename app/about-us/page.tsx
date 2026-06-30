import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About Us – TripprChale',
  description: 'Learn about TripprChale — India\'s favourite youth group travel community.',
}

export default function AboutUsPage() {
  return (
    <>
      <Navbar />

      <main style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
        {/* Hero */}
        <div style={{ background: 'var(--navy)' }} className="py-14 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">About Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">Who we are &amp; what drives us</p>
        </div>

        {/* Coming Soon */}
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="text-7xl mb-6">🏕️</div>
          <h2 className="font-black text-3xl sm:text-4xl mb-3" style={{ color: 'var(--navy)' }}>
            Coming Soon!
          </h2>
          <p className="text-sm leading-relaxed max-w-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            We&apos;re putting together our story — the people, the passion, and the purpose behind
            TripprChale. Stay tuned!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/"
              className="btn-primary text-sm px-6 py-3">
              ← Back to Trips
            </Link>
            <a href="https://wa.me/918448622890?text=Hi%20TripprChale!%20I%20want%20to%20know%20more%20about%20you."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-all hover:scale-105"
              style={{ background: '#25D366', color: '#fff' }}>
              💬 Chat with Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
