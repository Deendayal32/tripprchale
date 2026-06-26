'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Phone, Menu, X, Search, ChevronRight, ChevronDown } from 'lucide-react'

type NavChild = { label: string; href: string; emoji?: string }
type NavLink  = { label: string; href: string; children?: NavChild[] }

type SearchResult = {
  id: number; name: string; destination: string; emoji: string
  price: number; category: string; seatsLeft: number; duration: string
}
type CategoryCount = { category: string; count: number }

/* ── Navigation structure ── */
const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Our Trips',
    href: '/#trips',
    children: [
      { label: 'All Trips',           href: '/#trips',                         emoji: '🌍' },
      { label: 'Weekend Getaways',    href: '/?category=weekend#trips',        emoji: '🏖️' },
      { label: 'Backpacking Tours',   href: '/?category=backpacking#trips',    emoji: '🎒' },
      { label: 'Himalayan Treks',     href: '/?category=himalayan#trips',      emoji: '🏔️' },
      { label: 'International Tours', href: '/?category=international#trips',  emoji: '✈️' },
    ],
  },
  { label: 'Custom Tours', href: '/#contact' },
  { label: 'Contact Us',   href: '/#contact' },
]

const CAT_META: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  all:           { label: 'All',           emoji: '🌍', color: '#555',          bg: 'rgba(0,0,0,0.06)' },
  weekend:       { label: 'Weekend',       emoji: '🏖️', color: '#16a34a',       bg: 'rgba(34,197,94,0.1)' },
  backpacking:   { label: 'Backpacking',   emoji: '🎒', color: 'var(--primary)', bg: 'rgba(255,140,66,0.1)' },
  himalayan:     { label: 'Himalayan',     emoji: '🏔️', color: 'var(--sky)',     bg: 'rgba(41,171,226,0.1)' },
  international: { label: 'International', emoji: '✈️', color: 'var(--navy)',    bg: 'rgba(27,42,74,0.08)' },
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [query,       setQuery]       = useState('')
  const [activecat,     setActivecat]     = useState('all')
  const [results,       setResults]       = useState<SearchResult[]>([])
  const [catCounts,     setCatCounts]     = useState<CategoryCount[]>([])
  const [searching,     setSearching]     = useState(false)
  const [loadingCats,   setLoadingCats]   = useState(false)
  const [logoError,     setLogoError]     = useState(false)

  const inputRef    = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!searchOpen || catCounts.length > 0) return
    setLoadingCats(true)
    fetch('/api/trips/counts')
      .then(r => r.json())
      .then(data => { setCatCounts(data.counts ?? []); setLoadingCats(false) })
      .catch(() => setLoadingCats(false))
  }, [searchOpen, catCounts.length])

  const doSearch = useCallback((q: string, cat: string) => {
    const params = new URLSearchParams()
    if (q.trim())      params.set('search',   q.trim())
    if (cat !== 'all') params.set('category', cat)
    params.set('limit', '6')
    setSearching(true)
    fetch(`/api/trips?${params}`)
      .then(r => r.json())
      .then(data => { setResults(data.trips?.slice(0, 6) ?? []); setSearching(false) })
      .catch(() => setSearching(false))
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!searchOpen) return
    debounceRef.current = setTimeout(() => doSearch(query, activecat), 260)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, activecat, searchOpen, doSearch])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80)
      doSearch('', 'all')
    } else {
      setQuery(''); setResults([]); setActivecat('all')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen])

  function closeAll() { setMenuOpen(false); setSearchOpen(false) }

  function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault()
    setSearchOpen(false)
    const params = new URLSearchParams()
    if (query.trim())        params.set('search',   query.trim())
    if (activecat !== 'all') params.set('category', activecat)
    window.location.href = `/?${params}`
  }

  function goToTrip(id: number) { setSearchOpen(false); window.location.href = `/trips/${id}` }
  function getCatCount(cat: string) {
    if (cat === 'all') return catCounts.reduce((s, c) => s + c.count, 0)
    return catCounts.find(c => c.category === cat)?.count ?? 0
  }

  return (
    <>
      {/* ══════════ NAVBAR BAR ══════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${scrolled ? 'navbar-scrolled' : ''}`}
        style={{ background: 'rgba(255,255,255,0.96)', borderBottom: '1px solid rgba(27,42,74,0.08)' }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group min-w-0">
            {!logoError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/IMG_9734.PNG" alt="TripprChale" width={38} height={38}
                className="rounded-full object-contain transition-transform group-hover:scale-105 shrink-0"
                style={{ background: 'white', padding: '2px' }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
                style={{ background: 'var(--primary)' }}>TC</div>
            )}
            <div className="leading-tight min-w-0">
              <div className="font-black text-sm tracking-wide whitespace-nowrap">
                <span style={{ color: 'var(--primary)' }}>TRIP</span>
                <span style={{ color: 'var(--navy)' }}>PR</span>
                <span style={{ color: 'var(--sky)' }}>CHALE</span>
              </div>
              <div className="text-xs font-medium hidden sm:block" style={{ color: 'var(--text-light)', lineHeight: 1 }}>
                Where Memories Are Made!!
              </div>
            </div>
          </Link>

          {/* Desktop nav links with hover dropdown */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(link => (
              <li key={link.label} className="relative group">
                {link.children ? (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all hover:bg-orange-50"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.label}
                      <ChevronDown size={13} className="transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    {/* Desktop hover dropdown */}
                    <div className="absolute top-full left-0 mt-1 w-56 rounded-2xl overflow-hidden shadow-xl opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200"
                      style={{ background: 'white', border: '1px solid rgba(27,42,74,0.09)', zIndex: 60 }}>
                      {link.children.map(child => (
                        <Link key={child.href} href={child.href}
                          className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all hover:bg-orange-50 border-b last:border-0"
                          style={{ color: 'var(--text-muted)', borderColor: 'rgba(27,42,74,0.05)' }}>
                          <span className="text-base">{child.emoji}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={link.href}
                    className="px-3 py-2 text-sm font-medium rounded-lg transition-all hover:bg-orange-50 block"
                    style={{ color: 'var(--text-muted)' }}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button type="button"
              onClick={() => { setMenuOpen(false); setSearchOpen(o => !o) }}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-all hover:bg-orange-50"
              style={{ color: 'var(--text-muted)' }} aria-label="Search trips">
              <Search size={17} style={{ color: 'var(--navy)' }} />
              <span className="hidden sm:inline text-xs">Search trips…</span>
            </button>

            <Link href="/admin"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-orange-50"
              style={{ color: 'var(--text-muted)' }}>
              🛠 Admin
            </Link>

            <a href="tel:+918448622890"
              className="hidden lg:flex items-center gap-2 text-sm font-semibold text-white rounded-full px-4 py-2 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #E07330 100%)', boxShadow: 'var(--shadow-orange)' }}>
              <Phone size={14} /> +91 84486 22890
            </a>

            <button type="button"
              className="lg:hidden p-2 rounded-lg transition-all hover:bg-orange-50"
              style={{ color: 'var(--navy)' }}
              onClick={() => { setSearchOpen(false); setMenuOpen(o => !o) }}
              aria-label="Toggle menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════ SEARCH DROPDOWN ══════════ */}
      {searchOpen && (
        <>
          <div className="fixed inset-0 z-[38]" onClick={() => setSearchOpen(false)} aria-hidden="true" />
          <div className="fixed left-0 right-0 z-40 border-t"
            style={{ top: '4rem', background: 'rgba(15,25,50,0.97)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
                <div className="flex flex-1 items-center gap-2.5 rounded-xl px-4 py-2.5"
                  style={{ background: 'rgba(255,255,255,0.09)', border: '1.5px solid rgba(255,255,255,0.14)' }}>
                  <Search size={15} className="text-white/35 shrink-0" />
                  <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search destinations, trips…"
                    className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none" />
                  {searching
                    ? <div className="w-3.5 h-3.5 border border-white/20 border-t-white rounded-full animate-spin shrink-0" />
                    : query && <button type="button" onClick={() => setQuery('')}><X size={13} className="text-white/30" /></button>}
                </div>
                <button type="submit" className="btn-primary text-xs px-4 py-2.5 shrink-0">Search</button>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white transition-colors p-1">
                  <X size={18} />
                </button>
              </form>

              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(CAT_META).map(([cat, meta]) => {
                  const isActive = activecat === cat
                  return (
                    <button key={cat} onClick={() => { setActivecat(cat); doSearch(query, cat) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: isActive ? meta.color : 'rgba(255,255,255,0.07)',
                        color:      isActive ? 'white'    : 'rgba(255,255,255,0.6)',
                        border:     isActive ? 'none'     : '1px solid rgba(255,255,255,0.1)',
                        transform:  isActive ? 'scale(1.05)' : 'scale(1)',
                      }}>
                      <span>{meta.emoji}</span><span>{meta.label}</span>
                      {loadingCats
                        ? <span className="w-3 h-3 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                        : <span className="opacity-60 font-normal">({getCatCount(cat)})</span>}
                    </button>
                  )
                })}
              </div>

              {results.length > 0 && (
                <div className="rounded-xl overflow-hidden mb-3" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  {results.map((t, idx) => {
                    const cm = CAT_META[t.category] ?? CAT_META.all
                    return (
                      <button key={t.id} onClick={() => goToTrip(t.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b last:border-0"
                        style={{ background: idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-xl shrink-0">{t.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-semibold truncate">{t.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-white/40 text-xs truncate">{t.destination}</span>
                            <span className="text-white/20 text-xs">·</span>
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: cm.bg, color: cm.color }}>
                              {cm.emoji} {cm.label}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold" style={{ color: 'var(--primary)' }}>₹{t.price.toLocaleString('en-IN')}</div>
                          <div className="text-xs mt-0.5" style={{ color: t.seatsLeft <= 5 ? '#f87171' : 'rgba(255,255,255,0.35)' }}>
                            {t.seatsLeft <= 5 ? `🔥 ${t.seatsLeft} left` : `${t.seatsLeft} seats`}
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-white/20 shrink-0" />
                      </button>
                    )
                  })}
                  <button type="button"
                    onClick={() => { setSearchOpen(false); const p = new URLSearchParams(); if (query.trim()) p.set('search', query.trim()); if (activecat !== 'all') p.set('category', activecat); window.location.href = `/?${p}` }}
                    className="w-full text-center py-2.5 text-xs font-medium"
                    style={{ color: 'var(--sky)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {query ? `See all results for "${query}"` : `See all ${activecat === 'all' ? '' : CAT_META[activecat]?.label} trips`} →
                  </button>
                </div>
              )}

              {!searching && results.length === 0 && (query.trim() || activecat !== 'all') && (
                <div className="text-center py-6 text-white/30">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm">No trips found{query ? ` for "${query}"` : ''}</p>
                  <button onClick={() => { setQuery(''); setActivecat('all') }} className="text-xs mt-2 underline" style={{ color: 'var(--primary)' }}>Clear filters</button>
                </div>
              )}
              {!searching && results.length === 0 && !query.trim() && activecat === 'all' && (
                <p className="text-center text-white/25 text-xs py-2">Start typing or pick a category above</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══════════ MOBILE MENU ══════════ */}
      {menuOpen && (
        <>
          {/* Backdrop – tap outside to close */}
          <div className="fixed inset-0" style={{ zIndex: 48 }} onClick={closeAll} aria-hidden="true" />

          {/* Menu panel */}
          <div className="fixed left-0 right-0 border-t shadow-2xl overflow-y-auto"
            style={{ top: '4rem', background: '#ffffff', borderColor: 'rgba(27,42,74,0.1)', zIndex: 49, maxHeight: 'calc(100dvh - 4rem)' }}>

            {/* ── Nav items ── */}
            <ul className="px-3 pt-3 pb-1">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  {link.children ? (
                    /* Always-visible grouped section */
                    <div>
                      {/* Section label */}
                      <div className="px-4 pt-3 pb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
                          Our Trips
                        </span>
                      </div>
                      {/* Sub-items always shown, indented with accent border */}
                      <ul className="ml-3 mb-1 border-l-2 pl-1" style={{ borderColor: 'rgba(255,140,66,0.3)' }}>
                        {link.children.map(child => (
                          <li key={child.href}>
                            <Link href={child.href}
                              className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium rounded-xl transition-all hover:bg-orange-50"
                              style={{ color: 'var(--text-muted)' }}
                              onClick={closeAll}>
                              <span className="text-base shrink-0">{child.emoji}</span>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    /* Plain link */
                    <Link href={link.href}
                      className="block px-4 py-3.5 text-sm font-medium rounded-xl transition-all hover:bg-orange-50"
                      style={{ color: 'var(--text-muted)' }}
                      onClick={closeAll}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* ── Divider ── */}
            <div className="mx-4 my-1" style={{ borderTop: '1px solid rgba(27,42,74,0.07)' }} />

            {/* ── Extra links ── */}
            <ul className="px-3 py-2">
              <li>
                <Link href="/admin"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium rounded-xl transition-all hover:bg-orange-50"
                  style={{ color: 'var(--text-light)' }}
                  onClick={closeAll}>
                  🛠 Admin Panel
                </Link>
              </li>
              <li>
                <a href="https://wa.me/919717096999"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium rounded-xl transition-all hover:bg-green-50"
                  style={{ color: '#16a34a' }}
                  onClick={closeAll}>
                  💬 WhatsApp Us
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/tripprchale?igsh=OWV1czhwYThvZW11&utm_source=qr"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium rounded-xl transition-all hover:bg-pink-50"
                  style={{ color: '#E1306C' }}
                  onClick={closeAll}>
                  📸 Follow on Instagram
                </a>
              </li>
            </ul>

            {/* ── Call CTA ── */}
            <div className="px-4 pb-5 pt-2">
              <div className="flex flex-col gap-2">
                <a href="tel:+918448622890"
                  className="flex items-center gap-2 justify-center text-sm font-semibold text-white rounded-2xl px-4 py-3 transition-all"
                  style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #E07330 100%)', boxShadow: 'var(--shadow-orange)' }}>
                  <Phone size={15} /> +91 84486 22890
                </a>
                <a href="tel:+919136090840"
                  className="flex items-center gap-2 justify-center text-sm font-semibold text-white rounded-2xl px-4 py-3 transition-all"
                  style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #E07330 100%)', boxShadow: 'var(--shadow-orange)' }}>
                  <Phone size={15} /> +91 91360 90840
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ FLOATING WHATSAPP ══════════ */}
      <a href="https://wa.me/919717096999?text=Hi%20TripprChale!%20I%20want%20to%20check%20seat%20availability."
        target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp"
        className="fixed bottom-20 lg:bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}>
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.65 4.73 1.78 6.72L2 30l7.5-1.73A13.92 13.92 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.45 11.45 0 01-5.83-1.6l-.42-.25-4.45 1.03 1.06-4.33-.27-.44A11.5 11.5 0 1116 27.5zm6.3-8.6c-.35-.17-2.06-1.01-2.38-1.13-.32-.11-.55-.17-.78.18-.23.35-.88 1.13-1.08 1.36-.2.23-.4.26-.74.09-.35-.17-1.47-.54-2.8-1.73-1.03-.92-1.73-2.06-1.93-2.41-.2-.35-.02-.54.15-.71.15-.15.35-.4.52-.6.17-.2.23-.35.35-.58.11-.23.06-.43-.03-.6-.09-.17-.78-1.87-1.07-2.56-.28-.67-.57-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.32.35-1.2 1.17-1.2 2.86 0 1.68 1.23 3.31 1.4 3.54.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.06-.84 2.35-1.66.29-.82.29-1.52.2-1.66-.08-.14-.31-.23-.66-.4z"/>
        </svg>
      </a>
    </>
  )
}
