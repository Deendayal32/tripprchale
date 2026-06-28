'use client'

import { useState } from 'react'
import { Phone, Users, Share2 } from 'lucide-react'
import { Trip, Batch } from '@/lib/queries'

function fmtDate(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtShort(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

type SharingType = 'quad' | 'triple' | 'double' | 'standard'

export default function TripBookingCard({ trip }: { trip: Trip }) {
  const today    = new Date().toISOString().split('T')[0]
  const upcoming = trip.batches.filter(b => b.departureDate >= today)

  const [selectedBatch,   setSelectedBatch]   = useState<Batch | null>(upcoming[0] ?? trip.batches[0] ?? null)
  const [sharingType,     setSharingType]      = useState<SharingType>('standard')

  const rawPct = ((trip.totalSeats - trip.seatsLeft) / trip.totalSeats) * 100
  const pct    = Number.isFinite(rawPct) ? Math.min(Math.max(rawPct, 0), 100) : 0

  // Sharing-based pricing
  const allSharingOptions: { key: SharingType; label: string; price?: number }[] = [
    { key: 'quad',   label: 'Quad',   price: trip.quadPrice },
    { key: 'triple', label: 'Triple', price: trip.triplePrice },
    { key: 'double', label: 'Double', price: trip.doublePrice },
  ]
  const sharingOptions = allSharingOptions.filter(o => o.price != null)

  const hasSharing = sharingOptions.length > 0

  const displayPrice = hasSharing
    ? (sharingOptions.find(o => o.key === sharingType)?.price ?? trip.price)
    : trip.price

  const waBookLink = `https://wa.me/918448622890?text=${encodeURIComponent(
    `Hi TripprChale! 🙏\n\nI want to book this trip:\n\n` +
    `🏔️ Trip: ${trip.name}\n` +
    `📍 Destination: ${trip.destination}\n` +
    `⏱️ Duration: ${trip.duration}\n` +
    (selectedBatch ? `📅 Departure: ${fmtDate(selectedBatch.departureDate)}\n` : '') +
    `💰 Price: ₹${displayPrice.toLocaleString('en-IN')} per person\n` +
    (hasSharing && sharingType !== 'standard' ? `🛏️ Sharing: ${sharingType} sharing\n` : '') +
    `\nPlease share payment details to confirm my booking.`
  )}`

  function handleShare() {
    const url  = typeof window !== 'undefined' ? window.location.href : ''
    const text = `Check out this trip: ${trip.emoji} ${trip.name} – Starting ₹${trip.price.toLocaleString('en-IN')}/person\n${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
    {/* ── Mobile sticky bottom bar ── */}
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-t"
      style={{ borderColor: 'rgba(0,0,0,0.1)', boxShadow: '0 -4px 20px rgba(27,42,74,0.08)', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      <div className="shrink-0">
        <div className="font-bold text-xl" style={{ color: 'var(--primary)' }}>
          ₹{displayPrice.toLocaleString('en-IN')}
        </div>
        <div className="text-xs text-gray-400 leading-none">per person</div>
      </div>
      <a href={waBookLink} target="_blank" rel="noopener noreferrer"
        className="btn-primary flex-1 text-center text-sm"
        style={{ padding: '0.7rem 1rem' }}>
        🚀 Book Now
      </a>
      <button onClick={handleShare}
        className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white"
        style={{ background: '#25D366' }}
        aria-label="Share on WhatsApp">
        <Share2 size={16} />
      </button>
    </div>

    {/* ── Desktop booking card ── */}
    <div className="sticky top-24 rounded-3xl overflow-hidden shadow-xl" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>

      {/* Price header */}
      <div className="p-6" style={{ background: 'var(--navy)' }}>
        <div className="flex items-end gap-3 mb-1">
          <div className="font-bold text-3xl text-white">
            ₹{displayPrice.toLocaleString('en-IN')}
          </div>
          {trip.originalPrice && (
            <div className="text-white/50 text-sm line-through pb-1">
              ₹{trip.originalPrice.toLocaleString('en-IN')}
            </div>
          )}
        </div>
        <div className="text-white/60 text-xs">per person · all inclusive</div>
        {trip.originalPrice && (
          <div className="inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--yellow)', color: 'var(--navy)' }}>
            Save ₹{(trip.originalPrice - displayPrice).toLocaleString('en-IN')}!
          </div>
        )}
      </div>

      <div className="p-5 bg-white space-y-4">

        {/* Sharing type selector */}
        {hasSharing && (
          <div>
            <p className="text-xs text-gray-400 mb-2">Room Sharing Preference:</p>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${sharingOptions.length}, 1fr)` }}>
              {sharingOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSharingType(opt.key)}
                  className="text-xs font-semibold px-2 py-2 rounded-xl transition-all text-center"
                  style={{
                    background: sharingType === opt.key ? 'var(--primary)' : 'rgba(255,145,77,0.08)',
                    color:      sharingType === opt.key ? 'white'          : 'var(--primary)',
                    border:     `1.5px solid ${sharingType === opt.key ? 'var(--primary)' : 'rgba(255,145,77,0.25)'}`,
                  }}
                >
                  <div>{opt.label}</div>
                  <div className="font-bold mt-0.5">₹{opt.price!.toLocaleString('en-IN')}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advance badge */}
        <div className="rounded-xl py-2.5 px-3 flex items-center gap-2"
          style={{ background: 'rgba(255,145,77,0.08)', border: '1.5px dashed rgba(255,145,77,0.4)' }}>
          <span className="text-base">💳</span>
          <div>
            <span className="text-xs text-gray-500">Book now by paying just </span>
            <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
              ₹{trip.advanceAmount.toLocaleString('en-IN')} advance
            </span>
          </div>
        </div>

        {/* Seat fill bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1 text-gray-400">
              <Users size={12} /> {trip.totalSeats - trip.seatsLeft} booked
            </span>
            <span style={{ color: trip.seatsLeft <= 5 ? '#e53e3e' : 'var(--navy)', fontWeight: 600, fontSize: '0.75rem' }}>
              {trip.seatsLeft} seats left
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ background: '#f0f0f0' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: pct > 80 ? '#e53e3e' : 'var(--primary)' }} />
          </div>
        </div>

        {/* Selected batch pill */}
        {selectedBatch && (
          <div className="rounded-xl p-3 text-sm"
            style={{ background: 'rgba(0,194,255,0.06)', border: '1px solid rgba(0,194,255,0.2)' }}>
            <p className="text-xs text-gray-400 mb-0.5">Selected Departure</p>
            <p className="font-bold" style={{ color: 'var(--cyan)' }}>{fmtDate(selectedBatch.departureDate)}</p>
            <p className="text-xs font-medium"
              style={{ color: selectedBatch.status === 'Last Few Seats' ? '#e53e3e' : selectedBatch.status === 'Filling Fast' ? '#e65100' : '#2e7d32' }}>
              {selectedBatch.status} · {selectedBatch.seatsLeft} seats left
            </p>
          </div>
        )}

        {/* Date picker pills */}
        {upcoming.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-2">Pick a departure:</p>
            <div className="flex flex-wrap gap-1.5">
              {upcoming.slice(0, 4).map(b => (
                <button key={b.batchId} onClick={() => setSelectedBatch(b)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full transition-all"
                  style={{
                    background: selectedBatch?.batchId === b.batchId ? 'var(--cyan)' : 'rgba(0,194,255,0.1)',
                    color:      selectedBatch?.batchId === b.batchId ? 'white'       : 'var(--cyan)',
                    border: '1px solid rgba(0,194,255,0.3)',
                  }}>
                  {fmtShort(b.departureDate)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Book Now + Share */}
        <div className="flex gap-2">
          <a href={waBookLink} target="_blank" rel="noopener noreferrer"
            className="btn-primary flex-1 text-center block text-sm" style={{ padding: '0.85rem' }}>
            🚀 Book Now
          </a>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 px-4 rounded-full font-semibold text-sm transition-all hover:opacity-80"
            style={{ background: '#25D366', color: 'white' }}
            aria-label="Share on WhatsApp">
            <Share2 size={15} />
          </button>
        </div>

        {/* WhatsApp enquiry */}
        <a href={`https://wa.me/918448622890?text=${encodeURIComponent(`Hi TripprChale! 🙏\n\nI want to know more about:\n🏔️ ${trip.name}\n📍 ${trip.destination}\n⏱️ ${trip.duration}\n💰 Starting ₹${trip.price.toLocaleString('en-IN')}/person\n\nPlease share more details.`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full text-sm font-semibold py-3 rounded-full transition-all hover:bg-green-50"
          style={{ border: '2px solid #25D366', color: '#25D366' }}>
          💬 Ask on WhatsApp
        </a>

        {/* Call */}
        <div className="flex gap-2">
          <a href="tel:+918448622890"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-full transition-all hover:bg-gray-50 text-gray-500"
            style={{ border: '1.5px solid #e5e7eb' }}>
            <Phone size={13} /> 84486 22890
          </a>
          <a href="tel:+919136090840"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-full transition-all hover:bg-gray-50 text-gray-500"
            style={{ border: '1.5px solid #e5e7eb' }}>
            <Phone size={13} /> 91360 90840
          </a>
        </div>
      </div>
    </div>
    </>
  )
}
