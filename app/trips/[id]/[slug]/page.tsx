// ── SERVER COMPONENT – trip detail, all data from MySQL ──
export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTripById } from '@/lib/queries'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TripBookingCard from '@/components/TripBookingCard'
import TripTabs from '@/components/TripTabs'
import { MapPin, Clock, Users, ChevronLeft } from 'lucide-react'

type Props = {
  params: Promise<{ id: string; slug: string }>
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params
  const trip = await getTripById(id).catch(() => null)

  if (!trip) return notFound()

  const today = new Date().toISOString().split('T')[0]

  return (
    <main style={{ background: '#f8f9fa' }}>
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden h-56 sm:h-80 lg:h-[420px]" style={{ marginTop: '4rem' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" style={{ filter: 'brightness(0.65)' }} />
        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 py-8 max-w-7xl mx-auto w-full">
          <Link href="/" className="inline-flex items-center gap-1 text-white/70 text-sm mb-3 hover:text-white transition-colors w-fit">
            <ChevronLeft size={15} /> Back to Trips
          </Link>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="badge text-white" style={{ background: trip.badgeColor }}>{trip.badge}</span>
            <span className="badge text-white/80" style={{ background: 'rgba(255,255,255,0.15)' }}>{trip.durationBadge}</span>
          </div>
          <h1 className="font-bold text-white mb-2" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.15 }}>
            {trip.emoji} {trip.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={13} />{trip.destination}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} />{trip.duration}</span>
            <span className="flex items-center gap-1.5"><Users size={13} />Max {trip.totalSeats}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: trip.difficulty === 'Easy' ? '#e8f5e9' : '#fff3e0',
                       color:      trip.difficulty === 'Easy' ? '#2e7d32' : '#e65100' }}>
              {trip.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">

        {/* ── Left: tabbed content ── */}
        <div className="lg:col-span-2">

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { icon: '📅', label: 'Duration',    value: trip.duration },
              { icon: '👥', label: 'Group Size',  value: `Max ${trip.totalSeats}` },
              { icon: '🎯', label: 'Difficulty',  value: trip.difficulty },
              { icon: '🌍', label: 'Destination', value: trip.destination },
            ].map(({ icon, label, value }) => (
              <div key={label} className="rounded-2xl p-4 text-center"
                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                <div className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <TripTabs trip={trip} today={today} />
        </div>

        {/* ── Right: booking card (client) ── */}
        <div className="lg:col-span-1">
          <TripBookingCard trip={trip} />
        </div>
      </div>

      {/* Spacer so mobile sticky bar doesn't hide last content */}
      <div className="lg:hidden h-20" />
      <Footer />
    </main>
  )
}
