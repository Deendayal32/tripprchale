import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy – TripprChale',
  description: 'Cancellation and refund policy for TripPrChale Tour & Travels.',
}

const shortTripRules = [
  { label: 'Cancellations up to 60 days before departure date', value: '0% deduction' },
  { label: 'Between 59 days to 45 days before departure',       value: '50% deduction' },
  { label: 'Between 45 days to 25 days before departure',       value: '70% deduction' },
  { label: 'Between 24 days to 7 days before departure',        value: '80% deduction' },
  { label: 'Less than 7 days before departure',                 value: 'No refund' },
]

const longTripRules = [
  { label: 'Cancellations up to 75 days before departure date', value: '0% deduction' },
  { label: 'Between 75 days to 45 days before departure',       value: '50% deduction' },
  { label: 'Between 45 days to 15 days before departure',       value: '75% deduction' },
  { label: 'Less than 15 days of departure',                    value: 'No refund' },
]

const intlTripRules = [
  { label: 'Cancellations up to 75 days before departure date', value: '0% deduction' },
  { label: 'Between 75 days to 45 days before departure',       value: '50% deduction' },
  { label: 'Between 45 days to 30 days before departure',       value: '75% deduction' },
  { label: 'Less than 30 days of departure',                    value: 'No refund' },
]

function RefundTable({ rules }: { rules: { label: string; value: string }[] }) {
  return (
    <div className="rounded-xl overflow-hidden mt-3"
      style={{ border: '1px solid rgba(27,42,74,0.1)' }}>
      {rules.map(({ label, value }, i) => (
        <div key={i}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 text-sm"
          style={{
            borderBottom: i < rules.length - 1 ? '1px solid rgba(27,42,74,0.07)' : 'none',
            background: i % 2 === 0 ? 'white' : 'rgba(27,42,74,0.02)',
          }}>
          <span style={{ color: 'var(--text-muted)' }}>{label}</span>
          <span className="font-semibold shrink-0"
            style={{ color: value === 'No refund' ? '#dc2626' : '#16a34a' }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function CancellationPage() {
  return (
    <>
      <Navbar />

      <main style={{ background: 'var(--bg)', minHeight: '70vh' }}>
        {/* Hero */}
        <div style={{ background: 'var(--navy)' }} className="py-14 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Cancellation &amp; Refund Policy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">
            Last updated: June 2026
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-10">

          {/* Non-refundable notice */}
          <div className="rounded-xl px-5 py-4 font-semibold text-sm"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
            ⚠️ Booking Amount is Non-Refundable.
          </div>

          {/* Short trips */}
          <section>
            <h2 className="text-base font-bold mb-1" style={{ color: 'var(--navy)' }}>
              1. For Short Duration / Weekend Trips{' '}
              <span className="font-normal text-sm" style={{ color: 'var(--text-light)' }}>
                (Trips less than 3 Days)
              </span>
            </h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              The refund of the trip amount paid will be processed as per the deduction guidelines given below:
            </p>
            <RefundTable rules={shortTripRules} />
          </section>

          {/* Long trips */}
          <section>
            <h2 className="text-base font-bold mb-1" style={{ color: 'var(--navy)' }}>
              2. For Long Duration Trips{' '}
              <span className="font-normal text-sm" style={{ color: 'var(--text-light)' }}>
                (Trips more than 3 Days)
              </span>
            </h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              The refund of the total trip amount paid will be processed as per the deduction guidelines outlined below:
            </p>
            <RefundTable rules={longTripRules} />
          </section>

          {/* International trips */}
          <section>
            <h2 className="text-base font-bold mb-1" style={{ color: 'var(--navy)' }}>
              3. For International Trips{' '}
              <span className="font-normal text-sm" style={{ color: 'var(--text-light)' }}>
                (Trips more than 3 Days)
              </span>
            </h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              The refund of the total trip amount paid will be processed as per the deduction guidelines outlined below:
            </p>
            <RefundTable rules={intlTripRules} />
          </section>

          {/* Rules */}
          <section>
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--navy)' }}>
              4. Rules Applicable for Change / Cancellation of Booking by the Participant
            </h2>
            <div className="space-y-5">

              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                  1. Process
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Mail your cancellation/change request on{' '}
                  <a href="mailto:tripprchaleofficial@gmail.com"
                    style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    tripprchaleofficial@gmail.com
                  </a>.
                  No cancellations will be taken over phone calls or WhatsApp messages. We request
                  you to reply to the booking confirmation email that you have received at the time
                  of trip booking. Also, please note that the booking amount for all packages/trips
                  is non-refundable.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                  2. Replacement of Participant(s)
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Our community and guidelines allow you to seamlessly replace any of an individual
                  in your bookings. Please pay attention that this feature is applicable only when
                  the status of your booking is &quot;Paid&quot; and there should be at least 7 days
                  remaining prior to the departure date. Please note that the replacement would not
                  be applicable on any Volvo/Train/Flight transport booked for that particular
                  participant. The same would be automatically cancelled and the same will be
                  followed by. This is simply done because the seats booked in such transport
                  mediums are not transferable or refundable.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                  3. Mode of Refund
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Once your cancellation request gets confirmed, you will get a credit note via mail
                  in the next 2 working days.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                  4. Payment Gateway Charge
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  All the reimbursements/refunds will incur a Payment Gateway charge of 2.5% &amp;
                  GST of 5% respectively. The Payment Gateway charges will not be levied on the
                  customers who have made their transactions via UPI.
                </p>
              </div>

            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}
