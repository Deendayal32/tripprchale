'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Save, CheckCircle, AlertCircle, ChevronLeft, Upload, X, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react'

type Batch        = { departureDate: string; seatsLeft: number; status: string }
type Category     = { slug: string; label: string; emoji: string }
type ItineraryDay = { title: string; description: string }

const FALLBACK_CATS: Category[] = [
  { slug: 'weekend',       label: 'Weekend Getaways', emoji: '🏖️' },
  { slug: 'backpacking',   label: 'Backpacking',      emoji: '🎒' },
  { slug: 'himalayan',     label: 'Himalayan',         emoji: '🏔️' },
  { slug: 'international', label: 'International',     emoji: '✈️' },
]

const EMPTY_FORM = {
  name: '', destination: '', category: 'weekend', price: '', originalPrice: '',
  totalSeats: '20', seatsLeft: '20', image: '', emoji: '✈️',
  badge: 'New', badgeColor: '#FF914D', difficulty: 'Easy',
  duration: '', tagline: '',
  highlights:          ['', '', '', ''],
  includes:            ['', '', '', ''],
  exclusions:          ['', ''],
  batches:             [{ departureDate: '', seatsLeft: 20, status: 'Available' }] as Batch[],
  quadPrice:    '', triplePrice: '', doublePrice: '', advanceAmount: '2000',
  itinerary:           [{ title: '', description: '' }] as ItineraryDay[],
  cancellationPolicy:  '',
  tripTerms:           '',
}

export default function AdminCreatePage() {
  const [form,       setForm]       = useState({ ...EMPTY_FORM })
  const [status,     setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message,    setMessage]    = useState('')
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATS)
  const [uploading,  setUploading]  = useState(false)
  const [uploadErr,  setUploadErr]  = useState('')
  const [openDays,   setOpenDays]   = useState<Record<number, boolean>>({ 0: true })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (data.categories?.length) setCategories(data.categories) })
      .catch(() => {/* keep fallback */})
  }, [])

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  function setList(key: 'highlights' | 'includes' | 'exclusions', i: number, val: string) {
    setForm(f => { const a = [...f[key]]; a[i] = val; return { ...f, [key]: a } })
  }
  function addList(key: 'highlights' | 'includes' | 'exclusions') {
    setForm(f => ({ ...f, [key]: [...f[key], ''] }))
  }
  function removeList(key: 'highlights' | 'includes' | 'exclusions', i: number) {
    setForm(f => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }))
  }

  function setItinerary(i: number, field: keyof ItineraryDay, val: string) {
    setForm(f => { const a = [...f.itinerary]; a[i] = { ...a[i], [field]: val }; return { ...f, itinerary: a } })
  }
  function addItineraryDay() {
    const next = form.itinerary.length
    setForm(f => ({ ...f, itinerary: [...f.itinerary, { title: '', description: '' }] }))
    setOpenDays(d => ({ ...d, [next]: true }))
  }
  function removeItineraryDay(i: number) {
    setForm(f => ({ ...f, itinerary: f.itinerary.filter((_, idx) => idx !== i) }))
    setOpenDays(d => { const copy = { ...d }; delete copy[i]; return copy })
  }
  function toggleDay(i: number) { setOpenDays(d => ({ ...d, [i]: !d[i] })) }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setUploadErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      set('image', data.url)
    } catch (err: unknown) {
      setUploadErr(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function setBatch(i: number, field: keyof Batch, val: string | number) {
    setForm(f => { const b = [...f.batches]; b[i] = { ...b[i], [field]: val }; return { ...f, batches: b } })
  }
  function addBatch()          { setForm(f => ({ ...f, batches: [...f.batches, { departureDate: '', seatsLeft: 20, status: 'Available' }] })) }
  function removeBatch(i: number) { setForm(f => ({ ...f, batches: f.batches.filter((_, idx) => idx !== i) })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading'); setMessage('')
    const body = {
      name:          form.name.trim(),
      destination:   form.destination.trim(),
      category:      form.category,
      price:         Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      totalSeats:    Number(form.totalSeats),
      seatsLeft:     Number(form.seatsLeft),
      image:         form.image.trim(),
      emoji:         form.emoji,
      badge:         form.badge,
      badgeColor:    form.badgeColor,
      difficulty:    form.difficulty,
      duration:      form.duration,
      tagline:       form.tagline.trim(),
      highlights:    JSON.stringify(form.highlights.filter(Boolean)),
      includes:      JSON.stringify(form.includes.filter(Boolean)),
      exclusions:    JSON.stringify(form.exclusions.filter(Boolean)),
      quad_price:    form.quadPrice   ? Number(form.quadPrice)   : null,
      triple_price:  form.triplePrice ? Number(form.triplePrice) : null,
      double_price:  form.doublePrice ? Number(form.doublePrice) : null,
      advance_amount: Number(form.advanceAmount) || 2000,
      itinerary: JSON.stringify(
        form.itinerary
          .filter(d => d.title || d.description)
          .map((d, i) => ({ day: i + 1, title: d.title, description: d.description }))
      ),
      cancellation_policy: form.cancellationPolicy,
      trip_terms:          form.tripTerms,
      batches:       form.batches.filter(b => b.departureDate),
    }
    try {
      const res  = await fetch('/api/admin/trips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setStatus('success'); setMessage(`Trip "${form.name}" created! ID: ${data.id}`)
      setForm({ ...EMPTY_FORM })
      setOpenDays({ 0: true })
    } catch (err: unknown) {
      setStatus('error'); setMessage(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors"><ChevronLeft size={20} /></Link>
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--navy)' }}>Create New Trip</h1>
          <p className="text-gray-400 text-sm">Adds directly to MySQL</p>
        </div>
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 p-4 rounded-xl mb-6 text-sm text-green-700"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <CheckCircle size={16} /> {message}{' '}
          <Link href="/admin" className="underline ml-1">View all trips →</Link>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 rounded-xl mb-6 text-sm text-red-700"
          style={{ background: '#fff1f2', border: '1px solid #fecaca' }}>
          <AlertCircle size={16} /> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Basic Info ── */}
        <Section title="Basic Info">
          <Row label="Trip Name *"><Input required value={form.name} onChange={v => set('name', v)} placeholder="e.g. Kasol Kheerganga Trek" /></Row>
          <Row label="Destination *"><Input required value={form.destination} onChange={v => set('destination', v)} placeholder="e.g. Kasol, HP" /></Row>
          <Row label="Category *">
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: '#e5e7eb' }}>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.emoji} {c.label}</option>)}
            </select>
          </Row>
          <Row label="Duration *"><Input required value={form.duration} onChange={v => set('duration', v)} placeholder="5 Days / 4 Nights" /></Row>
          <Row label="Tagline"><Input value={form.tagline} onChange={v => set('tagline', v)} placeholder="e.g. Trek through pine forests & hot springs" /></Row>
          <Row label="Emoji"><Input value={form.emoji} onChange={v => set('emoji', v)} placeholder="✈️" /></Row>
          <Row label="Trip Image">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input value={form.image} onChange={v => { set('image', v); setUploadErr('') }} placeholder="https://… or upload →" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-opacity"
                  style={{ background: 'var(--primary)', opacity: uploading ? 0.6 : 1 }}>
                  {uploading
                    ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading…</>
                    : <><Upload size={13} /> Upload</>}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              {uploadErr && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{uploadErr}</p>}
              {form.image && !uploading && (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="Preview" className="h-28 w-48 object-cover rounded-xl border" style={{ borderColor: '#e5e7eb' }} />
                  <button type="button" onClick={() => set('image', '')}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={10} />
                  </button>
                </div>
              )}
              {!form.image && !uploading && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 w-full justify-center py-6 rounded-xl border-2 border-dashed text-gray-300 hover:text-gray-400 transition-colors"
                  style={{ borderColor: '#e5e7eb' }}>
                  <ImageIcon size={20} />
                  <span className="text-xs">Click to upload an image</span>
                </button>
              )}
            </div>
          </Row>
        </Section>

        {/* ── Pricing & Seats ── */}
        <Section title="Pricing & Seats">
          <Row label="Base Price (₹) *">
            <Input required type="number" value={form.price} onChange={v => set('price', v)} placeholder="Starting from price (e.g. 6499)" />
          </Row>
          <Row label="Original Price (₹)">
            <Input type="number" value={form.originalPrice} onChange={v => set('originalPrice', v)} placeholder="Strike-through price (optional)" />
          </Row>
          <div className="pt-2 pb-1">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--navy)' }}>Sharing-Based Prices</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Quad Sharing (₹)</label>
                <input type="number" value={form.quadPrice} onChange={e => set('quadPrice', e.target.value)} placeholder="e.g. 9999"
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors" style={{ borderColor: '#e5e7eb' }} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Triple Sharing (₹)</label>
                <input type="number" value={form.triplePrice} onChange={e => set('triplePrice', e.target.value)} placeholder="e.g. 11999"
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors" style={{ borderColor: '#e5e7eb' }} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Double Sharing (₹)</label>
                <input type="number" value={form.doublePrice} onChange={e => set('doublePrice', e.target.value)} placeholder="e.g. 14999"
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors" style={{ borderColor: '#e5e7eb' }} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Advance / Token Amount (₹)</label>
                <input type="number" value={form.advanceAmount} onChange={e => set('advanceAmount', e.target.value)} placeholder="2000"
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors" style={{ borderColor: '#e5e7eb' }} />
              </div>
            </div>
          </div>
          <Row label="Total Seats *"><Input required type="number" value={form.totalSeats} onChange={v => set('totalSeats', v)} /></Row>
          <Row label="Seats Left *"><Input required type="number" value={form.seatsLeft} onChange={v => set('seatsLeft', v)} /></Row>
          <Row label="Difficulty"><Select value={form.difficulty} onChange={v => set('difficulty', v)} options={['Easy','Moderate','Challenging']} /></Row>
        </Section>

        {/* ── Badge ── */}
        <Section title="Badge">
          <Row label="Badge Text"><Input value={form.badge} onChange={v => set('badge', v)} placeholder="Bestseller" /></Row>
          <Row label="Badge Colour">
            <div className="flex items-center gap-3">
              <input type="color" value={form.badgeColor} onChange={e => set('badgeColor', e.target.value)} className="h-9 w-12 rounded cursor-pointer border-0 p-0.5" />
              <span className="text-sm text-gray-500">{form.badgeColor}</span>
            </div>
          </Row>
        </Section>

        {/* ── Trip Highlights ── */}
        <Section title="Trip Highlights">
          {form.highlights.map((h, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={h} onChange={e => setList('highlights', i, e.target.value)} placeholder={`Highlight ${i+1}`}
                className="flex-1 text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: '#e5e7eb' }} />
              <button type="button" onClick={() => removeList('highlights', i)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addList('highlights')} className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--primary)' }}>
            <Plus size={13} /> Add highlight
          </button>
        </Section>

        {/* ── Inclusions & Exclusions ── */}
        <Section title="Inclusions & Exclusions">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Inclusions */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#16a34a' }}>✅ What&apos;s Included</p>
              {form.includes.map((inc, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={inc} onChange={e => setList('includes', i, e.target.value)} placeholder={`e.g. Hotel stay`}
                    className="flex-1 text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: '#e5e7eb' }} />
                  <button type="button" onClick={() => removeList('includes', i)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addList('includes')} className="text-xs flex items-center gap-1 mt-1" style={{ color: '#16a34a' }}>
                <Plus size={13} /> Add inclusion
              </button>
            </div>
            {/* Exclusions */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#dc2626' }}>❌ What&apos;s NOT Included</p>
              {form.exclusions.map((exc, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={exc} onChange={e => setList('exclusions', i, e.target.value)} placeholder={`e.g. Flight tickets`}
                    className="flex-1 text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: '#e5e7eb' }} />
                  <button type="button" onClick={() => removeList('exclusions', i)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addList('exclusions')} className="text-xs flex items-center gap-1 mt-1" style={{ color: '#dc2626' }}>
                <Plus size={13} /> Add exclusion
              </button>
            </div>
          </div>
        </Section>

        {/* ── Day-wise Itinerary ── */}
        <Section title="Day-wise Itinerary">
          <div className="space-y-3">
            {form.itinerary.map((day, i) => (
              <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(0,194,255,0.2)' }}>
                <div
                  className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none"
                  style={{ background: 'rgba(0,194,255,0.05)' }}
                  onClick={() => toggleDay(i)}
                >
                  <span className="text-xs font-bold shrink-0" style={{ color: 'var(--sky)' }}>Day {i+1}</span>
                  <input
                    value={day.title}
                    onChange={e => { e.stopPropagation(); setItinerary(i, 'title', e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    placeholder={`e.g. Day ${i+1}: Arrival & Sightseeing`}
                    className="flex-1 text-sm px-2 py-1 rounded border outline-none bg-white"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                  <button type="button" onClick={e => { e.stopPropagation(); removeItineraryDay(i) }} className="text-gray-300 hover:text-red-400 shrink-0">
                    <Trash2 size={13} />
                  </button>
                  <span className="text-gray-400 shrink-0">
                    {openDays[i] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </span>
                </div>
                {openDays[i] && (
                  <div className="px-4 pb-4 pt-2">
                    <label className="block text-xs text-gray-400 mb-1">Day Description</label>
                    <textarea
                      value={day.description}
                      onChange={e => setItinerary(i, 'description', e.target.value)}
                      placeholder="Describe activities, meals, travel for this day..."
                      rows={4}
                      className="w-full text-sm px-3 py-2 rounded-lg border outline-none resize-y focus:border-blue-400 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addItineraryDay} className="text-xs flex items-center gap-1 mt-3" style={{ color: 'var(--sky)' }}>
            <Plus size={13} /> Add Day
          </button>
        </Section>

        {/* ── Policies ── */}
        <Section title="Cancellation Policy">
          <textarea
            value={form.cancellationPolicy}
            onChange={e => set('cancellationPolicy', e.target.value)}
            placeholder="e.g. Cancellations made 15+ days before departure receive an 80% refund..."
            rows={5}
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none resize-y focus:border-orange-400 transition-colors"
            style={{ borderColor: '#e5e7eb' }}
          />
        </Section>

        <Section title="Terms & Conditions">
          <textarea
            value={form.tripTerms}
            onChange={e => set('tripTerms', e.target.value)}
            placeholder="e.g. All travellers must carry a valid government ID. Trip captain's decision is final..."
            rows={5}
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none resize-y focus:border-orange-400 transition-colors"
            style={{ borderColor: '#e5e7eb' }}
          />
        </Section>

        {/* ── Departure Batches ── */}
        <Section title="Departure Batches">
          {form.batches.map((b, i) => (
            <div key={i} className="flex flex-wrap gap-2 mb-3 p-3 rounded-xl"
              style={{ background: '#f8f9fc', border: '1px solid rgba(0,194,255,0.15)' }}>
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-gray-400 mb-1">Date</label>
                <input type="date" value={b.departureDate} onChange={e => setBatch(i, 'departureDate', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: '#e5e7eb' }} />
              </div>
              <div style={{ width: '90px' }}>
                <label className="block text-xs text-gray-400 mb-1">Seats</label>
                <input type="number" value={b.seatsLeft} onChange={e => setBatch(i, 'seatsLeft', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: '#e5e7eb' }} />
              </div>
              <div style={{ flex: '1', minWidth: '130px' }}>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <select value={b.status} onChange={e => setBatch(i, 'status', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: '#e5e7eb' }}>
                  <option>Available</option><option>Filling Fast</option><option>Last Few Seats</option>
                </select>
              </div>
              <div className="flex items-end pb-2">
                <button type="button" onClick={() => removeBatch(i)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addBatch} className="text-xs flex items-center gap-1" style={{ color: 'var(--sky)' }}>
            <Plus size={13} /> Add batch
          </button>
        </Section>

        <button type="submit" disabled={status === 'loading'}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3"
          style={{ opacity: status === 'loading' ? 0.7 : 1 }}>
          {status === 'loading'
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
            : <><Save size={16} /> Create Trip</>}
        </button>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
      <h3 className="font-semibold text-sm mb-4 pb-3" style={{ color: 'var(--navy)', borderBottom: '1px solid #f0f0f0' }}>{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
      <label className="text-xs text-gray-500 sm:w-40 shrink-0">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  )
}
type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { onChange: (v: string) => void }
function Input({ onChange, ...props }: InputProps) {
  return (
    <input {...props} onChange={e => onChange(e.target.value)}
      className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors"
      style={{ borderColor: '#e5e7eb' }} />
  )
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: '#e5e7eb' }}>
      {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
    </select>
  )
}
