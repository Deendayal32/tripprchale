// ── SERVER COMPONENT – trip detail, all data from MySQL ──
export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTripById } from '@/lib/queries'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TripBookingCard from '@/components/TripBookingCard'
import { MapPin, Clock, Users, ChevronLeft, Star, CheckCircle } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

function fmtDate(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params
  const trip = await getTripById(id).catch(() => null)

  if (!trip) return notFound()

  const today    = new Date().toISOString().split('T')[0]
  const upcoming = trip.batches.filter(b => b.departureDate >= today)
  const rawPct   = ((trip.totalSeats - trip.seatsLeft) / trip.totalSeats) * 100
  const pct      = Number.isFinite(rawPct) ? Math.min(Math.max(rawPct, 0), 100) : 0

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
          <h1 className="font-display font-bold text-white mb-2" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.15 }}>
            {trip.emoji} {trip.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={13} />{trip.destination}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} />{trip.duration}</span>
            <span className="flex items-center gap-1.5"><Users size={13} />Max {trip.totalSeats}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: trip.difficulty === 'Easy' ? '#e8f5e9' : '#fff3e0',
                       color: trip.difficulty === 'Easy' ? '#2e7d32' : '#e65100' }}>
              {trip.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">

        {/* ── Left: details ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '📅', label: 'Duration',   value: trip.duration },
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

          {/* Highlights */}
          {trip.highlights.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
              <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--navy)' }}>✨ Trip Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {trip.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,145,77,0.12)' }}>
                      <span style={{ color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 700 }}>→</span>
                    </div>
                    <span className="text-sm text-gray-700">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Includes */}
          {trip.includes.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
              <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--navy)' }}>✅ What&apos;s Included</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {trip.includes.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle size={15} style={{ color: '#22c55e', flexShrink: 0 }} />
                    <span className="text-sm text-gray-700">{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All batches */}
          {trip.batches.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
              <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--navy)' }}>📅 All Departure Dates</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {trip.batches.map(b => {
                  const isPast = b.departureDate < today
                  return (
                    <div key={b.batchId} className="rounded-xl p-4"
                      style={{ border: '1.5px solid rgba(0,194,255,0.2)', background: isPast ? '#f5f5f5' : 'white', opacity: isPast ? 0.5 : 1 }}>
                      <div className="font-bold text-sm mb-1" style={{ color: 'var(--cyan)' }}>
                        {fmtDate(b.departureDate)}
                      </div>
                      <div className="text-xs font-semibold mb-0.5"
                        style={{ color: isPast ? '#999' : b.status === 'Last Few Seats' ? '#e53e3e' : b.status === 'Filling Fast' ? '#e65100' : '#2e7d32' }}>
                        {isPast ? 'Departed' : b.status}
                      </div>
                      <div className="text-xs text-gray-400">{b.seatsLeft} seats left</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--navy)' }}>⭐ Traveller Reviews</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="font-bold text-4xl" style={{ color: 'var(--primary)' }}>4.9</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--yellow)" stroke="none" />)}
                </div>
                <div className="text-xs text-gray-400">Based on 120+ reviews</div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Priya S.',  text: 'Absolutely loved this trip! The captain was fantastic.' },
                { name: 'Rahul M.', text: 'Best experience ever. Will definitely book again!' },
              ].map(({ name, text }) => (
                <div key={name} className="p-3 rounded-xl" style={{ background: '#fafafa', border: '1px solid #f0f0f0' }}>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="var(--yellow)" stroke="none" />)}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">&ldquo;{text}&rdquo;</p>
                  <div className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>{name}</div>
                </div>
              ))}
            </div>
          </div>
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
