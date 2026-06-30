'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  images: string[]
  alt: string
  emoji?: string
}

export default function TripImageCarousel({ images, alt, emoji }: Props) {
  const [current, setCurrent]       = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length])

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-8xl"
        style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0f3460 100%)' }}>
        {emoji}
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-full group select-none"
      onTouchStart={e => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={e => {
        if (touchStart === null) return
        const diff = touchStart - e.changedTouches[0].clientX
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
        setTouchStart(null)
      }}
    >
      {/* Main image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current]}
        alt={`${alt} — photo ${current + 1}`}
        className="w-full h-full object-contain transition-opacity duration-300"
        style={{ background: '#1a2640' }}
        key={current}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />

      {images.length > 1 && (
        <>
          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all
                       opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all
                       opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Counter badge */}
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          >
            {current + 1} / {images.length}
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to photo ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      i === current ? '22px' : '8px',
                  height:     '8px',
                  background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
                  boxShadow:  '0 1px 3px rgba(0,0,0,0.4)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
