'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Star, CalendarDays } from 'lucide-react'
import { Trip } from '@/lib/queries'

type Tab = 'overview' | 'itinerary' | 'inclusions' | 'policies'

function fmtDate(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })
}

const CARD = { background: 'white', border: '1px solid rgba(0,0,0,0.06)' }

export default function TripTabs({ trip, today }: { trip: Trip; today: string }) {
  const [tab, setTab]       = useState<Tab>('overview')
  const [openDay, setOpenDay] = useState<number | null>(0)

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'overview',   label: 'Overview',    emoji: '📋' },
    { key: 'itinerary',  label: 'Itinerary',   emoji: '🗓️' },
    { key: 'inclusions', label: 'Inclusions',  emoji: '✅' },
    { key: 'policies',   label: 'Policies',    emoji: '📜' },
  ]

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 text-xs sm:text-sm font-semibold py-2.5 px-2 rounded-xl transition-all"
            style={{
              background: tab === t.key ? 'var(--navy)' : 'transparent',
              color:      tab === t.key ? 'white'       : 'var(--text-muted)',
            }}
          >
            <span className="hidden sm:inline">{t.emoji} </span>{t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Tagline */}
          {trip.tagline && (
            <div className="rounded-2xl p-5" style={CARD}>
              <p className="text-base font-medium italic" style={{ color: 'var(--navy)' }}>
                &ldquo;{trip.tagline}&rdquo;
              </p>
            </div>
          )}

          {/* Highlights */}
          {trip.highlights.length > 0 && (
            <div className="rounded-2xl p-6" style={CARD}>
              <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--navy)' }}>✨ Trip Highlights</h2>
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

          {/* Departure dates */}
          {trip.batches.length > 0 && (
            <div className="rounded-2xl p-6" style={CARD}>
              <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--navy)' }}>
                <CalendarDays size={18} className="inline mr-2 mb-0.5" />
                All Departure Dates
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {trip.batches.map(b => {
                  const isPast = b.departureDate < today
                  return (
                    <div key={b.batchId} className="rounded-xl p-4"
                      style={{ border: '1.5px solid rgba(0,194,255,0.2)', background: isPast ? '#f5f5f5' : 'white', opacity: isPast ? 0.5 : 1 }}>
                      <div className="font-bold text-sm mb-1" style={{ color: 'var(--cyan)' }}>{fmtDate(b.departureDate)}</div>
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
          <div className="rounded-2xl p-6" style={CARD}>
            <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--navy)' }}>⭐ Traveller Reviews</h2>
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
                { name: 'Priya S.',  text: 'Absolutely loved this trip! The captain was fantastic and so organised.' },
                { name: 'Rahul M.', text: 'Best experience ever. Will definitely book again with TripprChale!' },
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
      )}

      {/* ── Itinerary ── */}
      {tab === 'itinerary' && (
        <div className="rounded-2xl overflow-hidden" style={CARD}>
          <div className="px-6 pt-6 pb-4">
            <h2 className="font-bold text-xl" style={{ color: 'var(--navy)' }}>🗓️ Day-wise Itinerary</h2>
          </div>
          {trip.itinerary.length === 0 ? (
            <div className="px-6 pb-8 text-center text-gray-400">
              <div className="text-3xl mb-3">📋</div>
              <p className="font-medium text-sm">Detailed itinerary coming soon</p>
              <p className="text-xs mt-1">Contact us on WhatsApp for a day-by-day schedule</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#f0f0f0' }}>
              {trip.itinerary.map((day, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenDay(openDay === i ? null : i)}
                    className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                      style={{ background: 'var(--navy)' }}>
                      {day.day}
                    </span>
                    <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--navy)' }}>
                      {day.title || `Day ${day.day}`}
                    </span>
                    <span className="text-gray-400 shrink-0">
                      {openDay === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {openDay === i && day.description && (
                    <div className="px-6 pb-5" style={{ paddingLeft: '4.5rem' }}>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{day.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Inclusions / Exclusions ── */}
      {tab === 'inclusions' && (
        <div className="rounded-2xl p-6" style={CARD}>
          <h2 className="font-bold text-xl mb-5" style={{ color: 'var(--navy)' }}>✅ What&apos;s Included &amp; Excluded</h2>
          {trip.includes.length === 0 && trip.exclusions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Inclusion details coming soon. Contact us for more info.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              {trip.includes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#16a34a' }}>Included</h3>
                  <div className="space-y-2.5">
                    {trip.includes.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                        <span className="text-sm text-gray-700">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Exclusions */}
              {trip.exclusions.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#dc2626' }}>Not Included</h3>
                  <div className="space-y-2.5">
                    {trip.exclusions.map((exc, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <XCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                        <span className="text-sm text-gray-700">{exc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Policies ── */}
      {tab === 'policies' && (
        <div className="space-y-4">
          <div className="rounded-2xl p-6" style={CARD}>
            <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--navy)' }}>❌ Cancellation Policy</h2>
            {trip.cancellationPolicy ? (
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{trip.cancellationPolicy}</p>
            ) : (
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Cancellations <strong>15+ days</strong> before departure: <span className="text-green-600 font-semibold">80% refund</span></p>
                <p>• Cancellations <strong>8–14 days</strong> before departure: <span className="text-yellow-600 font-semibold">50% refund</span></p>
                <p>• Cancellations <strong>7 days or less</strong>: <span className="text-red-600 font-semibold">No refund</span></p>
                <p>• No-shows are treated as same-day cancellations.</p>
              </div>
            )}
          </div>
          <div className="rounded-2xl p-6" style={CARD}>
            <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--navy)' }}>📜 Terms &amp; Conditions</h2>
            {trip.tripTerms ? (
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{trip.tripTerms}</p>
            ) : (
              <div className="space-y-2 text-sm text-gray-600">
                <p>• All travellers must carry a valid government-issued photo ID.</p>
                <p>• The trip captain&apos;s decision is final in all matters on the trip.</p>
                <p>• TripprChale reserves the right to modify itineraries due to weather or safety concerns.</p>
                <p>• Travellers with medical conditions must inform us before booking.</p>
                <p>• Behaviour endangering fellow travellers may result in removal without refund.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
