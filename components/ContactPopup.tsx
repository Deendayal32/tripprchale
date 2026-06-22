'use client'

import { useState, useEffect } from 'react'
import { X, Phone, MapPin, Users, Calendar, Send, CheckCircle, Loader2 } from 'lucide-react'

export default function ContactPopup() {
  const [visible,   setVisible]   = useState(false)
  const [minimised, setMinimised] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const [form, setForm] = useState({
    name: '', phone: '', email: '', travellers: '1',
    destination: '', date: '', message: '',
  })

  // Show popup after 4s on first visit
  useEffect(() => {
    if (typeof window === 'undefined') return
    const seen = sessionStorage.getItem('tc_popup_shown')
    if (seen) return
    const t = setTimeout(() => {
      setVisible(true)
      sessionStorage.setItem('tc_popup_shown', '1')
    }, 4000)
    return () => clearTimeout(t)
  }, [])

  function set(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required')
      return
    }
    setLoading(true); setError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed z-40 flex items-center gap-2 text-sm font-semibold text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        style={{
          bottom: '5.5rem', right: '1.5rem',
          background: 'linear-gradient(135deg, var(--primary), #E07330)',
          boxShadow: '0 4px 20px rgba(255,140,66,0.4)',
        }}
        title="Plan your trip"
      >
        ✈️ Plan My Trip
      </button>
    )
  }

  return (
    <div
      className="fixed z-40 rounded-2xl shadow-2xl overflow-hidden flex flex-col
        left-3 right-3 bottom-[5.5rem] max-h-[calc(100dvh-7rem)]
        sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px] sm:max-h-none"
      style={{
        border: '1px solid rgba(27,42,74,0.1)',
        boxShadow: '0 20px 60px rgba(27,42,74,0.2)',
      }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0f2040 100%)' }}>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IMG_9734.PNG" alt="TripprChale" width={36} height={36}
            className="rounded-full object-contain" style={{ background: 'white', padding: '2px' }} />
          <div>
            <div className="font-bold text-sm text-white">
              <span style={{ color: 'var(--primary)' }}>TRIP</span><span style={{ color: 'rgba(255,255,255,0.75)' }}>PR</span><span style={{ color: 'var(--sky)' }}>CHALE</span>
            </div>
            <div className="text-xs text-white/50">Plan your perfect trip ✨</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimised(m => !m)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs"
          >
            {minimised ? '▲' : '▼'}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!minimised && (
        <div className="bg-white overflow-y-auto flex-1">
          {submitted ? (
            /* Success state */
            <div className="px-6 py-10 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.1)' }}>
                <CheckCircle size={32} style={{ color: '#16a34a' }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--navy)' }}>You're all set! 🎉</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Thanks <strong>{form.name}</strong>! We'll contact you on <strong>{form.phone}</strong> within 30 minutes.
              </p>
              <a
                href={`https://wa.me/919717096999?text=Hi%20TripprChale!%20I%20filled%20the%20enquiry%20form.%20My%20name%20is%20${encodeURIComponent(form.name)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-all hover:scale-105"
                style={{ background: '#25D366' }}
              >
                💬 Chat on WhatsApp too
              </a>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
              <p className="text-xs text-gray-400 mb-1">Fill in your details and we'll plan the perfect trip for you!</p>

              {error && (
                <div className="text-xs text-red-600 p-2 rounded-lg" style={{ background: '#fff1f2' }}>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Your Name *</label>
                  <input required value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors"
                    style={{ borderColor: '#e5e7eb' }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone *</label>
                  <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                    <span className="text-xs text-gray-400 px-2 border-r shrink-0" style={{ borderColor: '#e5e7eb' }}>+91</span>
                    <input required value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="9876543210" type="tel"
                      className="flex-1 text-sm px-2 py-2 outline-none bg-transparent" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Destination / Interest</label>
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: '#e5e7eb' }}>
                  <MapPin size={13} className="text-gray-300 shrink-0" />
                  <input value={form.destination} onChange={e => set('destination', e.target.value)}
                    placeholder="Manali, Goa, Rajasthan…"
                    className="flex-1 text-sm outline-none bg-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">No. of Travellers</label>
                  <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: '#e5e7eb' }}>
                    <Users size={13} className="text-gray-300 shrink-0" />
                    <select value={form.travellers} onChange={e => set('travellers', e.target.value)}
                      className="flex-1 text-sm outline-none bg-transparent">
                      {['1','2','3','4','5','6','7','8','9','10','10+'].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Preferred Date</label>
                  <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: '#e5e7eb' }}>
                    <Calendar size={13} className="text-gray-300 shrink-0" />
                    <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                      className="flex-1 text-sm outline-none bg-transparent" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Message (optional)</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)}
                  placeholder="Any specific requirements, budget, or questions?"
                  rows={2}
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors resize-none"
                  style={{ borderColor: '#e5e7eb' }} />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
                  : <><Send size={14} /> Plan My Trip</>}
              </button>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-300">or reach us directly</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="flex gap-2">
                <a href="https://wa.me/919717096999" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all hover:scale-105"
                  style={{ background: 'rgba(37,211,102,0.1)', color: '#16a34a', border: '1px solid rgba(37,211,102,0.2)' }}>
                  💬 WhatsApp
                </a>
                <a href="tel:+919589413700"
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all"
                  style={{ background: 'rgba(255,140,66,0.08)', color: 'var(--primary)', border: '1px solid rgba(255,140,66,0.2)' }}>
                  <Phone size={12} /> Call Us
                </a>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
