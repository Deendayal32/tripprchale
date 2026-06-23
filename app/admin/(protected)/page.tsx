// ── Admin Dashboard – Server Component ──
import Link from 'next/link'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import AdminTripRow from '@/components/AdminTripRow'
import { Plus, Tag, MessageSquare, Phone, Mail, MessageCircle } from 'lucide-react'

type PageProps = {
  searchParams: Promise<{ search?: string; category?: string }>
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const sp       = await searchParams
  const search   = sp.search   || ''
  const category = sp.category || 'all'

  // Build query
  let q = 'SELECT id, slug, name, destination, category, price, seatsLeft, totalSeats, badge, badgeColor, emoji, duration FROM trips WHERE 1=1'
  const params: (string | number)[] = []

  if (category !== 'all') { q += ' AND category = ?'; params.push(category) }
  if (search.trim())       { q += ' AND (name LIKE ? OR destination LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }

  q += ' ORDER BY id DESC'

  let trips: RowDataPacket[] = []
  let dbError = ''
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(q, params)
    trips = rows
  } catch (err) {
    dbError = String(err)
  }

  // Stats
  let totalTrips = 0, totalBatches = 0, lowSeats = 0, newLeads = 0, totalCategories = 0
  try {
    const [[{ cnt }]]  = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as cnt FROM trips') as [RowDataPacket[], unknown]
    totalTrips = cnt
    const [[{ bcnt }]] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as bcnt FROM batches') as [RowDataPacket[], unknown]
    totalBatches = bcnt
    const [[{ low }]]  = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as low FROM trips WHERE seatsLeft <= 5') as [RowDataPacket[], unknown]
    lowSeats = low
    const [[{ leads }]] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as leads FROM contacts') as [RowDataPacket[], unknown]
    newLeads = leads
    const [[{ cats }]]  = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as cats FROM categories') as [RowDataPacket[], unknown]
    totalCategories = cats
  } catch { /* ignore stats errors */ }

  // Load categories from DB for filter tabs
  let dbCategories: RowDataPacket[] = []
  try {
    const [catRows] = await pool.execute<RowDataPacket[]>('SELECT slug, label FROM categories ORDER BY sort_order ASC')
    dbCategories = catRows
  } catch { /* ignore */ }
  const categoryOptions = ['all', ...dbCategories.map(c => c.slug)]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--navy)' }}>Trip Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage all trips from MySQL</p>
        </div>
        <Link href="/admin/create"
          className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
          <Plus size={15} /> New Trip
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Total Trips',    value: totalTrips,      icon: '🗺️', color: 'var(--navy)' },
          { label: 'Total Batches',  value: totalBatches,    icon: '📅', color: 'var(--sky)' },
          { label: 'Low Seat Alert', value: lowSeats,        icon: '🔥', color: '#e53e3e' },
          { label: 'Showing Now',    value: trips.length,    icon: '🔍', color: 'var(--primary)' },
          { label: 'Categories',     value: totalCategories, icon: '🏷️', color: 'var(--teal)' },
          { label: 'Inquiries',      value: newLeads,        icon: '📩', color: '#7C5CBF' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="rounded-2xl p-4"
            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className="font-bold text-2xl" style={{ color }}>{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3"
        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>

        {/* Search */}
        <form method="GET" action="/admin" className="flex items-center gap-2 flex-1 min-w-[200px]">
          <input name="search" defaultValue={search} placeholder="Search by name or destination…"
            className="flex-1 text-sm px-4 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors"
            style={{ borderColor: '#e5e7eb' }} />
          {category !== 'all' && <input type="hidden" name="category" value={category} />}
          <button type="submit" className="btn-primary text-xs px-4 py-2 shrink-0">Search</button>
          {(search || category !== 'all') && (
            <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600 transition-colors shrink-0">Clear</Link>
          )}
        </form>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categoryOptions.map(cat => (
            <Link key={cat} href={`/admin?category=${cat}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
              style={{
                background: category === cat ? 'var(--primary)' : 'rgba(0,0,0,0.04)',
                color:      category === cat ? 'white'          : '#666',
              }}>
              {cat === 'all' ? '🌍 All' : dbCategories.find(c => c.slug === cat)?.label ?? cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links + Contact info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* Quick actions */}
        <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--navy)' }}>⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/admin/create',     icon: <Plus size={14} />,           label: 'New Trip',       color: 'var(--primary)' },
              { href: '/admin/categories', icon: <Tag size={14} />,            label: 'Categories',     color: 'var(--sky)' },
              { href: '/admin/contacts',   icon: <MessageSquare size={14} />,  label: 'View Contacts',  color: 'var(--teal)' },
              { href: '/',                 icon: <span className="text-xs">🌐</span>, label: 'View Site', color: 'var(--navy)' },
            ].map(({ href, icon, label, color }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(0,0,0,0.03)', color, border: '1px solid rgba(0,0,0,0.06)' }}>
                {icon} {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0f2040 100%)' }}>
          <h3 className="font-semibold text-sm mb-3 text-white">📞 Business Contact Info</h3>
          <div className="space-y-2.5">
            {[
              { icon: <Phone size={13} />, label: 'Sales / Bookings', value: '+91 958 941 3700', href: 'tel:+919589413700', color: 'var(--primary)' },
              { icon: <MessageCircle size={13} />, label: 'WhatsApp Enquiries', value: '+91 971 709 6999', href: 'https://wa.me/919717096999', color: '#25D366' },
              { icon: <Mail size={13} />, label: 'Email', value: 'hello@tripprchale.com', href: 'mailto:hello@tripprchale.com', color: 'var(--sky)' },
              { icon: <span className="text-xs">📸</span>, label: 'Instagram', value: '@tripprchale', href: 'https://www.instagram.com/tripprchale?igsh=OWV1czhwYThvZW11&utm_source=qr', color: '#E1306C' },
            ].map(({ icon, label, value, href, color }) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs group">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.1)', color }}>
                  {icon}
                </span>
                <div>
                  <div className="text-white/40">{label}</div>
                  <div className="font-semibold group-hover:underline" style={{ color }}>{value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {dbError && (
        <div className="p-4 rounded-xl mb-4 text-sm text-red-700"
          style={{ background: '#fff1f2', border: '1px solid #fecaca' }}>
          ⚠️ {dbError}
        </div>
      )}

      {/* Trip list */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-5 py-3 text-xs font-semibold text-gray-400 border-b"
          style={{ borderColor: '#f0f0f0' }}>
          <span>Trip</span>
          <span>Category</span>
          <span>Price</span>
          <span>Seats</span>
          <span>Actions</span>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">No trips found</p>
            <p className="text-sm mt-1">Try a different search or <Link href="/admin/create" className="underline" style={{ color: 'var(--primary)' }}>create one</Link></p>
          </div>
        ) : (
          trips.map(trip => (
            <AdminTripRow key={trip.id} trip={{
              id:          trip.id,
              slug:        trip.slug ?? '',
              name:        trip.name,
              destination: trip.destination,
              category:    trip.category,
              price:       trip.price,
              seatsLeft:   trip.seatsLeft,
              totalSeats:  trip.totalSeats,
              badge:       trip.badge,
              badgeColor:  trip.badgeColor,
              emoji:       trip.emoji,
              duration:    trip.duration,
            }} />
          ))
        )}
      </div>
    </div>
  )
}
