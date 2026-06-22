'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Category = { slug: string; label: string; emoji: string }

const MONTHS = [
  { value: 'all',     label: 'All Months' },
  { value: '2026-06', label: 'Jun' },
  { value: '2026-07', label: 'Jul' },
  { value: '2026-08', label: 'Aug' },
  { value: '2026-09', label: 'Sep' },
  { value: '2026-10', label: 'Oct' },
  { value: '2026-11', label: 'Nov' },
  { value: '2026-12', label: 'Dec' },
]

const FALLBACK: Category[] = [
  { slug: 'weekend',       label: 'Weekend Getaways', emoji: '🏖️' },
  { slug: 'backpacking',   label: 'Backpacking',      emoji: '🎒' },
  { slug: 'himalayan',     label: 'Himalayan',         emoji: '🏔️' },
  { slug: 'international', label: 'International',     emoji: '✈️' },
]

type Props = { activeCategory: string; activeMonth: string }

export default function TripFilters({ activeCategory, activeMonth }: Props) {
  const [categories, setCategories] = useState<Category[]>(FALLBACK)

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (data.categories?.length) setCategories(data.categories) })
      .catch(() => {/* keep fallback */})
  }, [])

  function catUrl(slug: string) {
    const p = new URLSearchParams()
    if (slug !== 'all') p.set('category', slug)
    if (activeMonth !== 'all') p.set('month', activeMonth)
    const q = p.toString()
    return q ? `/?${q}#trips` : '/#trips'
  }

  function monthUrl(value: string) {
    const p = new URLSearchParams()
    if (activeCategory !== 'all') p.set('category', activeCategory)
    if (value !== 'all') p.set('month', value)
    const q = p.toString()
    return q ? `/?${q}#trips` : '/#trips'
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Link href={catUrl('all')}
          className={`filter-tab text-sm px-4 py-2 rounded-full font-medium transition-all ${activeCategory === 'all' ? 'active' : ''}`}>
          🌍 All Trips
        </Link>
        {categories.map(({ slug, label, emoji }) => (
          <Link key={slug} href={catUrl(slug)}
            className={`filter-tab text-sm px-4 py-2 rounded-full font-medium transition-all ${activeCategory === slug ? 'active' : ''}`}>
            {emoji} {label}
          </Link>
        ))}
      </div>

      {/* Month tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {MONTHS.map(({ value, label }) => (
          <Link key={value} href={monthUrl(value)}
            className={`month-tab text-xs px-3 py-1.5 rounded-full font-medium transition-all ${activeMonth === value ? 'active' : ''}`}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
