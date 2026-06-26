import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms & Conditions – TripprChale',
  description: 'Read the terms and conditions for booking trips with TripprChale.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or booking any trip through TripprChale ("we", "us", "our"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.',
  },
  {
    title: '2. Bookings & Payments',
    body: 'All bookings are confirmed only upon receipt of the advance payment. Prices are quoted in Indian Rupees (INR) and include the items listed in the trip\'s "Includes" section. We reserve the right to adjust prices due to fuel surcharges, government levies, or currency fluctuations.',
  },
  {
    title: '3. Cancellation & Refund Policy',
    body: 'Cancellations made 15+ days before departure: 80% refund. 8–14 days before departure: 50% refund. 7 days or less before departure: No refund. Cancellations must be submitted in writing via email to hello@tripprchale.com. No-shows are treated as same-day cancellations.',
  },
  {
    title: '4. Itinerary Changes',
    body: 'TripprChale reserves the right to modify itineraries at any time due to weather conditions, road closures, force majeure events, or safety concerns. We will make every reasonable effort to provide alternatives of equal or greater value. No refunds will be issued for changes outside our control.',
  },
  {
    title: '5. Traveller Responsibilities',
    body: 'Travelers are responsible for carrying valid government-issued photo ID, obtaining any required permits or visas, ensuring their personal fitness for the trip\'s difficulty level, and behaving respectfully towards fellow travelers, guides, and local communities. TripprChale may remove any traveller whose behaviour endangers others, without refund.',
  },
  {
    title: '6. Health & Safety',
    body: 'Travelers with pre-existing medical conditions must disclose them at the time of booking. Participating in adventure activities (trekking, rafting, etc.) involves inherent risk. TripprChale is not liable for injuries arising from voluntary participation in such activities. We strongly recommend purchasing travel insurance.',
  },
  {
    title: '7. Liability Limitation',
    body: 'TripprChale acts as an organiser and is not liable for any loss, injury, damage, or delay caused by circumstances beyond our reasonable control including but not limited to natural disasters, strikes, or third-party service provider failures. Our maximum liability shall not exceed the amount paid for the trip.',
  },
  {
    title: '8. Photography & Media',
    body: 'By joining a TripprChale trip you grant us a royalty-free, non-exclusive licence to use photographs or videos taken during the trip for promotional purposes on our website and social media. You may opt out by notifying your trip captain in writing before the trip begins.',
  },
  {
    title: '9. Governing Law',
    body: 'These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.',
  },
  {
    title: '10. Contact',
    body: 'For any questions about these Terms, please contact us at tripprchaleofficial@gmail.com or call +91 84486 22890 / +91 91360 90840.',
  },
]

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main style={{ background: 'var(--bg)', minHeight: '70vh' }}>
        {/* Hero */}
        <div style={{ background: 'var(--navy)' }} className="py-14 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Terms &amp; Conditions
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">
            Last updated: June 2025
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
            Please read these Terms &amp; Conditions carefully before booking a trip with TripprChale.
            These terms apply to all travelers and bookings made through our website or any other channel.
          </p>

          <div className="space-y-8">
            {sections.map(({ title, body }) => (
              <section key={title}>
                <h2
                  className="text-base font-bold mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  {title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
