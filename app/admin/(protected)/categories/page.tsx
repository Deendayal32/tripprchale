'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, Trash2, Tag, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

type Category = {
  id: number
  slug: string
  label: string
  emoji: string
  sort_order: number
  trip_count: number
}

const EMOJI_PICKS = ['🌍','🏖️','🎒','🏔️','✈️','🏕️','🌊','🏜️','🌿','🌺','🎡','🏙️','🚂','🚤','⛷️','🤿']

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  const [label,   setLabel]   = useState('')
  const [slug,    setSlug]    = useState('')
  const [emoji,   setEmoji]   = useState('🗺️')
  const [adding,  setAdding]  = useState(false)
  const [addMsg,  setAddMsg]  = useState('')
  const [addErr,  setAddErr]  = useState('')

  const [deletingId, setDeletingId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/categories')
    const data = await res.json()
    if (res.ok) setCategories(data.categories)
    else setError(data.error || 'Failed to load categories')
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Auto-generate slug from label
  function handleLabelChange(val: string) {
    setLabel(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  async function handleAdd(e: React.BaseSyntheticEvent) {
    e.preventDefault()
    if (!label.trim() || !slug.trim()) return
    setAdding(true); setAddMsg(''); setAddErr('')
    const res  = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, slug, emoji }),
    })
    const data = await res.json()
    if (res.ok) {
      setAddMsg(`Category "${label}" created!`)
      setLabel(''); setSlug(''); setEmoji('🗺️')
      load()
    } else {
      setAddErr(data.error || 'Failed to create')
    }
    setAdding(false)
  }

  async function handleDelete(id: number, label: string, tripCount: number) {
    if (tripCount > 0) {
      alert(`Cannot delete "${label}" — it has ${tripCount} trips assigned. Reassign or delete those trips first.`)
      return
    }
    if (!confirm(`Delete category "${label}"?`)) return
    setDeletingId(id)
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    load()
    setDeletingId(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--navy)' }}>
            Trip Categories
          </h1>
          <p className="text-gray-400 text-sm">Create and manage custom trip categories</p>
        </div>
      </div>

      {/* Add category form */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
        <h3 className="font-semibold text-sm mb-4 pb-3" style={{ color: 'var(--navy)', borderBottom: '1px solid #f0f0f0' }}>
          Add New Category
        </h3>

        {addMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm text-green-700"
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <CheckCircle size={15} /> {addMsg}
          </div>
        )}
        {addErr && (
          <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm text-red-700"
            style={{ background: '#fff1f2', border: '1px solid #fecaca' }}>
            <AlertCircle size={15} /> {addErr}
          </div>
        )}

        <form onSubmit={handleAdd} className="space-y-4">
          {/* Emoji picker */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">Emoji Icon</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {EMOJI_PICKS.map(e => (
                <button
                  key={e} type="button"
                  onClick={() => setEmoji(e)}
                  className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all"
                  style={{
                    background: emoji === e ? 'rgba(255,140,66,0.15)' : 'rgba(0,0,0,0.04)',
                    border:     emoji === e ? '2px solid var(--primary)' : '2px solid transparent',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">or type:</span>
              <input
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                maxLength={4}
                className="w-16 text-center text-xl px-2 py-1 rounded-lg border outline-none"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Display Label *</label>
              <input
                required
                value={label}
                onChange={e => handleLabelChange(e.target.value)}
                placeholder="e.g. Hill Stations"
                className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">URL Slug *</label>
              <input
                required
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="e.g. hill-stations"
                className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:border-orange-400 transition-colors font-mono"
                style={{ borderColor: '#e5e7eb' }}
              />
              <p className="text-xs text-gray-400 mt-1">Used in URLs and filters. Lowercase letters, numbers, hyphens only.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={adding}
            className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
            style={{ opacity: adding ? 0.7 : 1 }}
          >
            {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {adding ? 'Creating…' : 'Create Category'}
          </button>
        </form>
      </div>

      {/* Categories list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: '#f0f0f0' }}>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>
            All Categories
          </h3>
          <span className="text-xs text-gray-400">{categories.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Loading…
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 text-sm">{error}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Tag size={28} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No categories yet. Create one above.</p>
          </div>
        ) : (
          categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 px-5 py-4 border-b last:border-0 hover:bg-gray-50/60 transition-colors"
              style={{ borderColor: '#f0f0f0' }}
            >
              {/* Rank */}
              <span className="text-xs text-gray-300 w-5 shrink-0 text-center">{idx + 1}</span>

              {/* Emoji badge */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'rgba(255,140,66,0.1)' }}>
                {cat.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{cat.label}</div>
                <div className="text-xs font-mono text-gray-400 mt-0.5">/{cat.slug}</div>
              </div>

              {/* Trip count */}
              <div className="text-center shrink-0 hidden sm:block">
                <div className="font-bold text-sm" style={{ color: cat.trip_count > 0 ? 'var(--primary)' : '#ccc' }}>
                  {cat.trip_count}
                </div>
                <div className="text-xs text-gray-400">trips</div>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(cat.id, cat.label, cat.trip_count)}
                disabled={deletingId === cat.id}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-gray-300 hover:text-red-500 hover:bg-red-50"
                title={cat.trip_count > 0 ? `${cat.trip_count} trips use this category` : 'Delete category'}
                style={{ opacity: deletingId === cat.id ? 0.5 : 1 }}
              >
                {deletingId === cat.id
                  ? <Loader2 size={13} className="animate-spin" />
                  : <Trash2 size={13} />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
