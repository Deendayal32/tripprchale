// ── SERVER COMPONENT – trip detail, all data from MySQL ──
export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTripById } from '@/lib/queries'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TripBookingCard from '@/components/TripBookingCard'
import TripTabs from '@/components/TripTabs'
import ContactPopup from '@/components/ContactPopup'
import { MapPin, Clock, Users, ChevronLeft } from 'lucide-react'
import TripImageCarousel from '@/components/TripImageCarousel'

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

      {/* ── Hero carousel ── */}
      <div style={{ marginTop: '4rem', height: 'clamp(220px, 40vw, 420px)', overflow: 'hidden' }}>
        <TripImageCarousel
          images={trip.images?.length ? trip.images : (trip.image ? [trip.image] : [])}
          alt={trip.name}
          emoji={trip.emoji}
        />
      </div>

      {/* ── Navy bar: back link + trip name + badges + meta ── */}
      <div style={{ background: '#1B2A4A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-5">

          {/* Back link */}
          <Link href="/"
            className="inline-flex items-center gap-1 text-xs mb-3 transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            <ChevronLeft size={13} /> Back to Trips
          </Link>

          {/* Title + badges row */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <h1
              className="font-bold leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', color: '#ffffff' }}>
              {trip.emoji} {trip.name}
            </h1>
            <div className="flex flex-wrap gap-2 shrink-0 mt-1">
              {trip.badge && (
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: trip.badgeColor, color: '#fff' }}>
                  {trip.badge}
                </span>
              )}
              {trip.category && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff' }}>
                  {trip.category}
                </span>
              )}
              {trip.durationBadge && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(41,171,226,0.25)', color: '#29ABE2' }}>
                  {trip.durationBadge}
                </span>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} style={{ color: '#FF8C42' }} />
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{trip.destination}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} style={{ color: '#29ABE2' }} />
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{trip.duration}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={13} style={{ color: '#2DBFBB' }} />
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>Max {trip.totalSeats} people</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-8">

        {/* Left: tabbed content */}
        <div className="lg:col-span-2">

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { icon: '📅', label: 'Duration',    value: trip.duration },
              { icon: '👥', label: 'Group Size',  value: `Max ${trip.totalSeats}` },
              { icon: '🚐', label: 'Pick & Drop',  value: 'Delhi - Delhi' },
              { icon: '👥', label: 'Age Group',   value: '18 - 35 Years' },
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

        {/* Right: booking card */}
        <div className="lg:col-span-1">
          <TripBookingCard trip={trip} />
        </div>
      </div>

      {/* Spacer so mobile sticky bar doesn't hide last content */}
      <div className="lg:hidden h-20" />
      <Footer />
      <ContactPopup />
    </main>
  )
}
