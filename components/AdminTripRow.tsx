'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2, ExternalLink } from 'lucide-react'

type Trip = {
  id: number
  slug: string
  name: string
  destination: string
  category: string
  price: number
  seatsLeft: number
  totalSeats: number
  badge: string
  badgeColor: string
  emoji: string
  duration: string
}

export default function AdminTripRow({ trip }: { trip: Trip }) {
  const router    = useRouter()
  const [deleting, setDeleting] = useState(false)
  const rawPct = ((trip.totalSeats - trip.seatsLeft) / trip.totalSeats) * 100
  const pct = Number.isFinite(rawPct) ? Math.min(Math.max(rawPct, 0), 100) : 0

  async function handleDelete() {
    if (!confirm(`Delete "${trip.name}"? This cannot be undone.`)) return
    setDeleting(true)
    const res = await fetch(`/api/admin/trips/${trip.id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('Delete failed')
      setDeleting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-5 py-4 border-b last:border-0 hover:bg-gray-50/60 transition-colors"
      style={{ borderColor: '#f0f0f0' }}>

      {/* Name + destination */}
      <div className="flex items-center gap-3 mb-2 sm:mb-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: 'rgba(255,145,77,0.1)' }}>
          {trip.emoji}
        </div>
        <div>
          <div className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{trip.name}</div>
          <div className="text-xs text-gray-400">{trip.destination} · {trip.duration}</div>
        </div>
      </div>

      {/* Category */}
      <div className="mb-1 sm:mb-0">
        <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
          style={{
            background: trip.category === 'himalayan' ? 'rgba(0,194,255,0.1)' :
                        trip.category === 'backpacking' ? 'rgba(255,145,77,0.1)' :
                        trip.category === 'international' ? 'rgba(27,42,74,0.1)' : 'rgba(34,197,94,0.1)',
            color: trip.category === 'himalayan' ? 'var(--cyan)' :
                   trip.category === 'backpacking' ? 'var(--primary)' :
                   trip.category === 'international' ? 'var(--navy)' : '#16a34a',
          }}>
          {trip.category}
        </span>
      </div>

      {/* Price */}
      <div className="font-bold text-sm mb-1 sm:mb-0" style={{ color: 'var(--primary)' }}>
        ₹{trip.price.toLocaleString('en-IN')}
      </div>

      {/* Seat bar */}
      <div className="mb-2 sm:mb-0 sm:pr-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{trip.seatsLeft} left</span>
          <span>{trip.totalSeats} total</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: '#f0f0f0' }}>
          <div className="h-full rounded-full"
            style={{ width: `${pct}%`, background: pct > 80 ? '#e53e3e' : 'var(--primary)' }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <Link href={`/trips/${trip.id}/${trip.slug}`} target="_blank"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
          title="View on site">
          <ExternalLink size={14} />
        </Link>
        <Link href={`/trips/${trip.id}/${trip.slug}`} target="_blank"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
          title="Edit (view on site)">
          <Edit2 size={14} />
        </Link>
        <button onClick={handleDelete} disabled={deleting}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          title="Delete" style={{ opacity: deleting ? 0.5 : 1 }}>
          {deleting
            ? <div className="w-3.5 h-3.5 border border-gray-300 border-t-red-400 rounded-full animate-spin" />
            : <Trash2 size={14} />}
        </button>
      </div>
    </div>
  )
}
