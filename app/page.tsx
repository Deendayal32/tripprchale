// ── SERVER COMPONENT – all data fetched from MySQL on the server ──
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSearch from '@/components/HeroSearch'
import TripFilters from '@/components/TripFilters'
import { getTrips, Trip } from '@/lib/queries'
import { MapPin, Clock, Users, ChevronRight, Star } from 'lucide-react'
import ContactPopup from '@/components/ContactPopup'

type PageProps = {
  searchParams: Promise<{ category?: string; month?: string; search?: string }>
}

function fmtDate(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default async function HomePage({ searchParams }: PageProps) {
  const sp       = await searchParams
  const category = sp.category || 'all'
  const month    = sp.month    || 'all'
  const search   = sp.search   || ''

  let trips: Trip[] = []
  let dbError = ''

  try {
    trips = await getTrips(category, month, search)
  } catch (err) {
    console.error('[HomePage] DB error:', err)
    dbError = 'Could not connect to database. Make sure MySQL is running and .env.local is configured.'
  }

  return (
    <main style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section
        className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #E8F3FF 0%, #F2ECFF 42%, #FFF2E8 100%)' }}
      >
        {/* Decorative blobs – use % sizes so they never cause horizontal overflow */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[520px] max-h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(41,171,226,0.18) 0%, transparent 68%)', transform: 'translate(28%,-18%)' }} />
        <div className="absolute bottom-0 left-0 w-[55vw] h-[55vw] max-w-[440px] max-h-[440px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,140,66,0.16) 0%, transparent 68%)', transform: 'translate(-22%,22%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[700px] max-h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(45,191,187,0.08) 0%, transparent 65%)' }} />

        {/* Floating mascot – responsive size */}
        <div className="animate-float mb-4 sm:mb-5 relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/IMG_9734.PNG"
            alt="TripprChale Mascot"
            className="mx-auto object-contain w-24 h-24 sm:w-36 sm:h-36 lg:w-[148px] lg:h-[148px]"
            style={{ filter: 'drop-shadow(0 12px 28px rgba(27,42,74,0.18))' }}
          />
        </div>

        {/* Live badge */}
        <div
          className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-5"
          style={{ background: 'rgba(255,140,66,0.1)', color: 'var(--primary)', border: '1.5px solid rgba(255,140,66,0.3)' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--primary)' }} />
          🚀 Youth Group Tours · India &amp; Beyond
        </div>

        {/* Brand heading */}
        <h1
          className="relative z-10 font-display mb-4 leading-none"
          style={{ fontSize: 'clamp(2.8rem,7vw,5rem)', fontWeight: 900 }}
        >
          <span style={{ color: 'var(--primary)' }}>TRIP</span><span style={{ color: 'var(--navy)' }}>PR</span><span style={{ color: 'var(--sky)' }}>CHALE</span>
        </h1>
        <p
          className="relative z-10 font-semibold mb-3"
          style={{ fontSize: 'clamp(1rem,2.5vw,1.4rem)', color: 'var(--navy)' }}
        >
          Where Memories Are Made!!
        </p>
        <p className="relative z-10 max-w-lg mb-7 sm:mb-9 text-sm leading-relaxed px-2" style={{ color: 'var(--text-muted)' }}>
          Join India's most energetic youth travel community — Himalayan treks,
          coastal escapes, and desert adventures, all at unbeatable prices.
        </p>

        {/* Search bar */}
        <div className="relative z-10 w-full max-w-lg">
          <Suspense fallback={<div className="h-14" />}>
            <HeroSearch defaultSearch={search} />
          </Suspense>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-4 gap-4 sm:gap-10 mt-10 sm:mt-12 w-full max-w-sm sm:max-w-none sm:w-auto">
          {[
            { value: `${trips.length || '10'}+`, label: 'Active Trips' },
            { value: '500+',  label: 'Travelers' },
            { value: '15+',   label: 'Destinations' },
            { value: '4.9★',  label: 'Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-bold text-xl sm:text-2xl" style={{ color: 'var(--navy)' }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5" style={{ opacity: 0.3 }}>
          <div className="text-xs font-medium" style={{ color: 'var(--navy)' }}>scroll</div>
          <div className="w-px h-8 rounded-full animate-pulse" style={{ background: 'var(--navy)' }} />
        </div>
      </section>

      {/* ══════════ TRIP GRID ══════════ */}
      <section id="trips" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3"
            style={{ background: 'rgba(41,171,226,0.1)', color: 'var(--sky)', border: '1px solid rgba(41,171,226,0.2)' }}>
            ✨ Handpicked Adventures
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-2" style={{ color: 'var(--navy)' }}>
            Upcoming Trips
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Filter by category or month to find your perfect trip</p>
        </div>

        <Suspense fallback={<div className="h-16" />}>
          <TripFilters activeCategory={category} activeMonth={month} />
        </Suspense>

        <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-light)' }}>
          {dbError
            ? <span className="text-red-500">{dbError}</span>
            : <><strong style={{ color: 'var(--primary)' }}>{trips.length}</strong> trips found</>
          }
        </p>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
        ) : !dbError ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-lg">No trips found</p>
            <p className="text-sm mt-1">Try a different filter or month</p>
            <Link href="/" className="mt-6 btn-primary text-sm inline-flex">Reset Filters</Link>
          </div>
        ) : null}
      </section>

      {/* ══════════ WHY CHOOSE US ══════════ */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-blue)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3"
              style={{ background: 'rgba(255,140,66,0.1)', color: 'var(--primary)', border: '1px solid rgba(255,140,66,0.2)' }}>
              💎 The TripprChale Advantage
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">
              <span style={{ color: '#FF914D' }}>Why Trippr</span><span style={{ color: '#1B2A4A' }}>chale?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: 'Your Safety is Our Topmost Priority',
                desc: 'Verified trip captains, 24/7 SOS coordination, and zero-compromise security on solo female-friendly group tours.',
              },
              {
                title: '24/7 Dedicated On-Trip Support',
                desc: 'An active centralized backend customer happiness team responding to queries in under 5 minutes.',
              },
              {
                title: '100% Secure & Flexible Payment Options',
                desc: 'Book your seat by paying an advance token amount via encrypted Razorpay/UPI loop channels.',
              },
              {
                title: 'Premium, Comfortable & Sanitized Vehicles',
                desc: 'Spacious Force Travelers and luxury AC Volvos driven by mountain-certified commercial experts.',
              },
              {
                title: 'Energetic & Certified Trip Captains',
                desc: 'Not just boring guides—our captains are high-energy storytellers who turn strangers into a travel family.',
              },
              {
                title: 'Like-Minded Youth Communities Only',
                desc: 'Strictly curated age groups (18-35) ensuring premium networking, campfire jams, and high-vibe dosto-wala atmosphere.',
              },
              {
                title: 'Handpicked & Highly Hygienic Stays',
                desc: 'Tested boutique hostels, premium camps, and cozy stays with great vibes and comfortable facilities.',
              },
              {
                title: 'Government-Mandated Compliances',
                desc: 'Full alignment with local transport, state tourism laws, and premium local networks.',
              },
            ].map(({ title, desc }) => (
              <div key={title}
                className="flex gap-4 rounded-2xl p-5 bg-white transition-all duration-300 hover:-translate-y-0.5"
                style={{ border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
                <span className="text-xl font-bold shrink-0 mt-0.5" style={{ color: '#FF914D' }}>✓</span>
                <div>
                  <div className="font-semibold text-sm mb-1" style={{ color: 'var(--navy)' }}>{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-warm)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3"
              style={{ background: 'rgba(255,213,92,0.2)', color: '#B8860B', border: '1px solid rgba(255,213,92,0.4)' }}>
              ⭐ Real Travelers, Real Stories
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: 'var(--navy)' }}>
              What Our Travelers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', trip: 'Kasol Manali Adventure',   avatar: '👩', text: 'Absolutely loved it! The trip captain was fantastic and the group was super fun. TripprChale made it stress-free!' },
              { name: 'Rahul M.', trip: 'Goa Beach Backpacking',    avatar: '👨', text: 'Best 5 days of my life. Met amazing people, the itinerary was perfectly balanced between fun and exploration.' },
              { name: 'Sneha K.', trip: 'Rajasthan Royal Escapade', avatar: '👩‍🦱', text: 'The desert safari was mind-blowing. TripprChale never disappoints — every detail was thought through!' },
            ].map(({ name, trip, avatar, text }) => (
              <div key={name} className="rounded-2xl p-6 bg-white"
                style={{ border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--yellow)" stroke="none" />)}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                    style={{ background: 'var(--bg-blue)' }}>
                    {avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-light)' }}>{trip}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section id="contact" className="relative py-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #FF6B20 100%)' }}>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.08)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.06)', transform: 'translate(-25%,25%)' }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-4">🎒</div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
            Ready to Make Memories?
          </h2>
          <p className="text-white/80 mb-9 text-sm leading-relaxed">
            Reach out on WhatsApp or call us to check seat availability.<br />
            Our team responds in under 5 minutes!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-xs sm:max-w-none mx-auto">
            <a href="https://wa.me/919717096999?text=Hi%20TripprChale!%20I%20want%20to%20book%20a%20trip."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg w-full sm:w-auto justify-center"
              style={{ color: '#16a34a' }}>
              💬 WhatsApp Us
            </a>
            <a href="tel:+918448622890"
              className="flex items-center gap-2.5 text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all hover:bg-white/15 w-full sm:w-auto justify-center"
              style={{ border: '2px solid rgba(255,255,255,0.55)' }}>
              📞 +91 84486 22890
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <ContactPopup />
    </main>
  )
}

// ── Trip Card ─────────────────────────────────────────────────
function TripCard({ trip }: { trip: Trip }) {
  const rawPct = ((trip.totalSeats - trip.seatsLeft) / trip.totalSeats) * 100
  const pct    = Number.isFinite(rawPct) ? Math.min(Math.max(rawPct, 0), 100) : 0
  const today = new Date().toISOString().split('T')[0]
  const next3 = (trip.batches ?? []).filter(b => b.departureDate >= today).slice(0, 3)

  return (
    <Link href={`/trips/${trip.id}/${trip.slug}`} className="block group">
      <div className="trip-card bg-white rounded-2xl overflow-hidden h-full"
        style={{ border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>

        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {trip.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={trip.image} alt={trip.name} className="trip-img w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl"
              style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0f3460 100%)' }}>
              {trip.emoji}
            </div>
          )}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(27,42,74,0.6) 0%, transparent 55%)' }} />
          <div className="duration-badge">{trip.durationBadge}</div>
          <div className="badge absolute top-3 right-3 text-white"
            style={{ background: trip.badgeColor, fontSize: '0.62rem' }}>
            {trip.badge}
          </div>
          {trip.seatsLeft <= 5 && (
            <div className="absolute bottom-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: '#E53E3E' }}>
              🔥 Only {trip.seatsLeft} left!
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div>
              <h3 className="font-bold text-sm leading-snug mb-1" style={{ color: 'var(--navy)' }}>
                {trip.emoji} {trip.name}
              </h3>
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-light)' }}>
                <MapPin size={11} />{trip.destination}
                <span className="mx-1">·</span>
                <Clock size={11} />{trip.duration}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-lg" style={{ color: 'var(--primary)' }}>
                ₹{trip.price.toLocaleString('en-IN')}
              </div>
              {trip.originalPrice && (
                <div className="text-xs line-through" style={{ color: 'var(--text-light)' }}>
                  ₹{trip.originalPrice.toLocaleString('en-IN')}
                </div>
              )}
              <div className="text-xs" style={{ color: 'var(--text-light)' }}>/person</div>
            </div>
          </div>

          {/* Batch dates */}
          {next3.length > 0 && (
            <div className="mb-3">
              <p className="text-xs mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>📅 Upcoming Batches:</p>
              <div className="flex flex-wrap gap-1.5">
                {next3.map(b => (
                  <span key={b.batchId} className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(41,171,226,0.1)', color: 'var(--sky)', border: '1px solid rgba(41,171,226,0.22)' }}>
                    {fmtDate(b.departureDate)}
                    {b.status === 'Last Few Seats' && ' 🔴'}
                    {b.status === 'Filling Fast'   && ' 🟡'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Seat bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-light)' }}>
              <span className="flex items-center gap-1"><Users size={11} />{trip.totalSeats - trip.seatsLeft} booked</span>
              <span style={{ color: trip.seatsLeft <= 5 ? 'var(--red)' : 'var(--text-light)' }}>{trip.seatsLeft} seats left</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: '#EEF5FF' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: pct > 80 ? 'var(--red)' : 'var(--primary)' }} />
            </div>
          </div>

          <div className="btn-primary w-full text-sm py-2.5 justify-center">
            View Trip <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  )
}
