'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, Users, Phone, Mail, MapPin, Calendar, MessageSquare, RefreshCw } from 'lucide-react'

type Contact = {
  id: number
  name: string
  email: string
  phone: string
  travellers: string
  destination: string
  date: string
  message: string
  created_at: string
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    const res  = await fetch('/api/admin/contacts')
    const data = await res.json()
    if (res.ok) setContacts(data.contacts)
    else setError(data.error || 'Failed to load')
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--navy)' }}>
              Contact Inquiries
            </h1>
            <p className="text-gray-400 text-sm">All website contact form submissions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,140,66,0.1)', color: 'var(--primary)' }}>
            {contacts.length} total
          </span>
          <button onClick={load}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Leads',  value: contacts.length,                              icon: '📋', color: 'var(--navy)' },
          { label: 'Today',        value: contacts.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length, icon: '📅', color: 'var(--sky)' },
          { label: 'With Message', value: contacts.filter(c => c.message?.trim()).length,  icon: '💬', color: 'var(--primary)' },
          { label: 'Group Trips',  value: contacts.filter(c => Number(c.travellers) > 2).length, icon: '👥', color: 'var(--teal)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="rounded-2xl p-4"
            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className="font-bold text-2xl" style={{ color }}>{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <RefreshCw size={20} className="animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading inquiries…</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 text-sm p-6">{error}</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No inquiries yet</p>
            <p className="text-sm mt-1">Contact form submissions will appear here</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#f0f0f0' }}>
            {contacts.map(c => (
              <div key={c.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 sm:w-48 shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--primary), #E07330)' }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{c.name}</div>
                      <div className="text-xs text-gray-400">{fmtDate(c.created_at)}</div>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={13} className="shrink-0" style={{ color: 'var(--primary)' }} />
                      <a href={`tel:${c.phone}`} className="hover:underline" style={{ color: 'var(--navy)' }}>{c.phone}</a>
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-2 text-sm truncate">
                        <Mail size={13} className="shrink-0" style={{ color: 'var(--sky)' }} />
                        <a href={`mailto:${c.email}`} className="hover:underline truncate" style={{ color: 'var(--sky)' }}>{c.email}</a>
                      </div>
                    )}
                    {c.destination && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={13} className="shrink-0" style={{ color: 'var(--teal)' }} />
                        <span style={{ color: 'var(--navy)' }}>{c.destination}</span>
                      </div>
                    )}
                    {c.travellers && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={13} className="shrink-0 text-gray-400" />
                        <span className="text-gray-600">{c.travellers} traveler{Number(c.travellers) !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {c.date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={13} className="shrink-0 text-gray-400" />
                        <span className="text-gray-600">{c.date}</span>
                      </div>
                    )}
                    {c.message && (
                      <div className="flex items-start gap-2 text-sm sm:col-span-2 lg:col-span-3">
                        <MessageSquare size={13} className="shrink-0 mt-0.5 text-gray-400" />
                        <span className="text-gray-600 leading-relaxed">{c.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-2 shrink-0">
                    <a href={`https://wa.me/91${c.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105"
                      style={{ background: '#25D366', color: 'white' }}>
                      💬 WhatsApp
                    </a>
                    <a href={`tel:${c.phone}`}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                      style={{ background: 'rgba(255,140,66,0.1)', color: 'var(--primary)', border: '1px solid rgba(255,140,66,0.25)' }}>
                      📞 Call
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
