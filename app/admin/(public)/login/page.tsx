'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff, AlertCircle, MapPin } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res  = await fetch('/api/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Login failed')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0d1528' }}>

      {/* ── Left brand panel (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 relative overflow-hidden px-10 py-12"
        style={{ background: 'linear-gradient(160deg, #1B2A4A 0%, #0d1528 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,140,66,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(41,171,226,0.18) 0%, transparent 70%)', transform: 'translate(30%,20%)' }} />

        {/* Logo + brand name */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/IMG_9734.PNG" alt="TripprChale" width={52} height={52}
              className="rounded-2xl object-contain shadow-lg"
              style={{ background: 'white', padding: '4px' }} />
            <div>
              <div className="font-black text-xl leading-none">
                <span style={{ color: '#FF8C42' }}>TRIP</span>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>PR</span>
                <span style={{ color: '#29ABE2' }}>CHALE</span>
              </div>
              <div className="text-white/35 text-xs mt-0.5 font-medium tracking-widest uppercase">Admin Panel</div>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-5 mt-8">
            {[
              { icon: '🗺️', title: 'Manage Trips',    desc: 'Create, edit, and publish adventures' },
              { icon: '📅', title: 'Batch Schedules',  desc: 'Set departure dates & seat counts'   },
              { icon: '📩', title: 'View Enquiries',   desc: 'Track leads from contact forms'      },
              { icon: '🏷️', title: 'Categories',      desc: 'Organise trips by type & region'     },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-white/80 text-sm font-semibold leading-none">{f.title}</p>
                  <p className="text-white/35 text-xs mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/20 text-xs flex items-center gap-1.5">
          <MapPin size={11} />
          TripprChale · Crafting Unforgettable Journeys
        </p>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">

        {/* Mobile background blobs */}
        <div className="lg:hidden fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #FF8C42 0%, transparent 70%)', transform: 'translate(30%,-20%)' }} />
        <div className="lg:hidden fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #29ABE2 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />

        <div className="w-full max-w-sm">

          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/IMG_9734.PNG" alt="TripprChale" width={72} height={72}
              className="rounded-2xl mx-auto mb-4 shadow-lg object-contain"
              style={{ background: 'white', padding: '5px' }} />
            <h1 className="font-black text-2xl">
              <span style={{ color: '#FF8C42' }}>TRIP</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>PR</span>
              <span style={{ color: '#29ABE2' }}>CHALE</span>
            </h1>
            <p className="text-white/40 text-xs mt-1 tracking-widest uppercase">Admin Panel</p>
          </div>

          {/* Card */}
          <div className="rounded-3xl p-8 shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(24px)' }}>

            {/* Top accent bar */}
            <div className="h-1 w-16 rounded-full mb-6" style={{ background: 'linear-gradient(90deg, #FF8C42, #29ABE2)' }} />

            <h2 className="font-bold text-white text-xl mb-1">Welcome back</h2>
            <p className="text-white/40 text-xs mb-7">Sign in to manage your trips</p>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm text-red-300"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Username</label>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)' }}>
                  <User size={14} className="text-white/30 shrink-0" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    placeholder="admin"
                    className="flex-1 bg-transparent text-white placeholder-white/20 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)' }}>
                  <Lock size={14} className="text-white/30 shrink-0" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-white placeholder-white/20 text-sm outline-none"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all"
                style={{
                  background: loading ? 'rgba(255,140,66,0.5)' : 'linear-gradient(135deg, #FF8C42 0%, #E07330 100%)',
                  boxShadow: loading ? 'none' : '0 4px 18px rgba(255,140,66,0.35)',
                }}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                ) : (
                  <>Sign In →</>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-white/20 text-xs mt-6">
            Authorised staff only · TripprChale © 2025
          </p>
        </div>
      </div>
    </div>
  )
}
