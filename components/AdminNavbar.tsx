'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, LogOut, Plus, List, Home, X, Tag, MessageSquare, Menu } from 'lucide-react'

type SearchResult = { id: number; name: string; destination: string; emoji: string; price: number; category: string }

const NAV_ITEMS = [
  { href: '/admin',            icon: <List size={14} />,          label: 'Trips' },
  { href: '/admin/create',     icon: <Plus size={14} />,          label: 'New Trip' },
  { href: '/admin/categories', icon: <Tag size={14} />,           label: 'Categories' },
  { href: '/admin/contacts',   icon: <MessageSquare size={14} />, label: 'Contacts' },
  { href: '/',                 icon: <Home size={14} />,          label: 'View Site' },
]

export default function AdminNavbar() {
  const router   = useRouter()
  const pathname = usePathname()

  const [query,          setQuery]          = useState('')
  const [results,        setResults]        = useState<SearchResult[]>([])
  const [searching,      setSearching]      = useState(false)
  const [dropdownOpen,   setDropdownOpen]   = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const inputRef    = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); setSearching(false); return }
    setSearching(true)
    fetch(`/api/admin/trips?search=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => { setResults(data.trips?.slice(0, 6) ?? []); setSearching(false) })
      .catch(() => setSearching(false))
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 280)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(href: string) { return pathname === href }

  return (
    <>
      {/* ── Main nav bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-3 sm:px-6 shadow-md"
        style={{ background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2 shrink-0 mr-3 sm:mr-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IMG_9734.PNG" alt="TripprChale" width={30} height={30}
            className="rounded-full object-contain"
            style={{ background: 'white', padding: '2px' }} />
          <div className="hidden xs:block" style={{ lineHeight: 1.15 }}>
            <div className="font-black text-sm leading-none">
              <span style={{ color: 'var(--primary)' }}>TRIP</span>
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>PR</span>
              <span style={{ color: 'var(--sky)' }}>CHALE</span>
            </div>
            <div className="text-xs font-medium leading-none mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 mr-4">
          {NAV_ITEMS.map(({ href, icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: isActive(href) ? 'rgba(255,145,77,0.15)' : 'transparent',
                color:      isActive(href) ? 'var(--primary)' : 'rgba(255,255,255,0.65)',
              }}>
              {icon}{label}
            </Link>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex-1 min-w-0 max-w-xs relative">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={13} className="text-white/35 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setDropdownOpen(true) }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              placeholder="Search trips…"
              className="flex-1 bg-transparent text-white placeholder-white/30 text-xs outline-none min-w-0"
            />
            {searching && <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin shrink-0" />}
            {query && <button onClick={() => { setQuery(''); setResults([]) }}><X size={12} className="text-white/30" /></button>}
          </div>

          {/* Search results dropdown */}
          {dropdownOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-xl z-50"
              style={{ background: '#1a2d4a', border: '1px solid rgba(255,255,255,0.1)' }}>
              {results.map(t => (
                <button key={t.id}
                  onMouseDown={() => router.push(`/trips/${t.id}`)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors text-left border-b last:border-0"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{t.emoji}</span>
                    <div>
                      <div className="text-white text-xs font-medium">{t.name}</div>
                      <div className="text-white/40 text-xs">{t.destination} · {t.category}</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold shrink-0" style={{ color: 'var(--primary)' }}>
                    ₹{t.price.toLocaleString('en-IN')}
                  </div>
                </button>
              ))}
            </div>
          )}
          {dropdownOpen && !searching && query.trim() && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl px-4 py-3 text-xs text-white/40 shadow-xl z-50"
              style={{ background: '#1a2d4a', border: '1px solid rgba(255,255,255,0.1)' }}>
              No trips found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Right: logout + hamburger */}
        <div className="flex items-center gap-1 ml-2">
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all shrink-0">
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>

          {/* Hamburger – mobile only */}
          <button
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile slide-down menu ── */}
      {mobileMenuOpen && (
        <div
          className="fixed left-0 right-0 z-40 md:hidden border-t shadow-xl"
          style={{ top: '3.5rem', background: 'var(--navy)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <ul className="py-2">
            {NAV_ITEMS.map(({ href, icon, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all"
                  style={{
                    background: isActive(href) ? 'rgba(255,145,77,0.12)' : 'transparent',
                    color:      isActive(href) ? 'var(--primary)' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {icon} {label}
                </Link>
              </li>
            ))}
            <li className="px-6 pt-2 pb-3">
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout() }}
                className="flex items-center gap-2 text-sm font-medium py-3 w-full"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
