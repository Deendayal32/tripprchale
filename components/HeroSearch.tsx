'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function HeroSearch({ defaultSearch = '' }: { defaultSearch?: string }) {
  const [value, setValue] = useState(defaultSearch)

  return (
    <form
      method="GET"
      action="/"
      className="flex items-center gap-2 w-full max-w-lg"
      aria-label="Search trips"
    >
      <div
        className="flex flex-1 items-center gap-3 rounded-full px-5 py-3 bg-white"
        style={{ border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <Search size={16} className="shrink-0" style={{ color: 'var(--text-light)' }} />
        <input
          type="text"
          name="search"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Search Kasol, Goa, Spiti…"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--text)', caretColor: 'var(--primary)' }}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue('')}
            className="transition-colors"
            style={{ color: 'var(--text-light)' }}
          >
            <X size={14} />
          </button>
        )}
      </div>
      <button type="submit" className="btn-primary text-sm px-5 py-3 shrink-0">
        Search
      </button>
    </form>
  )
}
