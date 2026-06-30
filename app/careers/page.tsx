import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Career With Us – TripprChale',
  description: 'Join the TripprChale team and help build India\'s favourite youth travel community.',
}

export default function CareersPage() {
  return (
    <>
      <Navbar />

      <main style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
        {/* Hero */}
        <div style={{ background: 'var(--navy)' }} className="py-14 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Career With Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">Join our growing team of travel enthusiasts</p>
        </div>

        {/* Coming Soon */}
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="text-7xl mb-6">🚀</div>
          <h2 className="font-black text-3xl sm:text-4xl mb-3" style={{ color: 'var(--navy)' }}>
            Coming Soon!
          </h2>
          <p className="text-sm leading-relaxed max-w-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            We&apos;re building something exciting — career opportunities at TripprChale will be
            listed here soon. Want to join the team early?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/"
              className="btn-primary text-sm px-6 py-3">
              ← Back to Trips
            </Link>
            <a href="mailto:tripprchaleofficial@gmail.com?subject=Career%20Enquiry%20-%20TripprChale"
              className="flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-full border-2 transition-all hover:scale-105"
              style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>
              ✉️ Email Your CV
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
