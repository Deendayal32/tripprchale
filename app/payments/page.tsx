import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Building2, Smartphone, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Payments – TripprChale',
  description: 'Safe & Secure payment options for booking your TripprChale trip.',
}

export default function PaymentsPage() {
  return (
    <>
      <Navbar />

      <main style={{ background: 'var(--bg)', minHeight: '70vh' }}>
        {/* Hero */}
        <div style={{ background: 'var(--navy)' }} className="py-14 px-4 text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck size={48} style={{ color: '#FF914D' }} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Safe &amp; Secure Payments
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)' }} className="text-sm max-w-xl mx-auto leading-relaxed">
            Pay the specified advance token amount of your trip package to book your seat
            using the following official modes:
          </p>
        </div>

        {/* Payment cards */}
        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 space-y-6">

          {/* Bank Transfer */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white"
            style={{ border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(27,42,74,0.1)' }}>
                <Building2 size={20} style={{ color: '#1B2A4A' }} />
              </div>
              <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>
                Bank Transfer Details
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Account Name', value: 'TRIP PR CHALE TOUR & TRAVELS' },
                { label: 'Bank Name',    value: 'HDFC Bank' },
                { label: 'Account No',  value: '50200105228321' },
                { label: 'IFSC Code',   value: 'HDFC0009522' },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2"
                  style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <span className="text-xs font-semibold uppercase tracking-wide w-32 shrink-0"
                    style={{ color: 'var(--text-light)' }}>
                    {label}
                  </span>
                  <span className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* UPI */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white"
            style={{ border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,145,77,0.12)' }}>
                <Smartphone size={20} style={{ color: '#FF914D' }} />
              </div>
              <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>
                UPI Payment
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide w-32 shrink-0"
                style={{ color: 'var(--text-light)' }}>
                UPI ID
              </span>
              <span className="font-bold text-base" style={{ color: '#FF914D' }}>
                8448622890@hdfc
              </span>
            </div>
          </div>

          {/* Info note */}
          <div className="rounded-xl px-5 py-4 text-sm leading-relaxed"
            style={{ background: 'rgba(41,171,226,0.08)', border: '1px solid rgba(41,171,226,0.2)', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--navy)' }}>Note:</strong> After making the payment,
            please share your payment screenshot on WhatsApp at{' '}
            <a href="tel:+918448622890" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              +91 84486 22890
            </a>{' '}
            or email us at{' '}
            <a href="mailto:tripprchaleofficial@gmail.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              tripprchaleofficial@gmail.com
            </a>{' '}
            to confirm your seat.
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
