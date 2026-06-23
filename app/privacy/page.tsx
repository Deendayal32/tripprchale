import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy – TripprChale',
  description: 'Learn how TripprChale collects, uses, and protects your personal information.',
}

const sections = [
  {
    title: '1. Information We Collect',
    body: 'When you book a trip or contact us, we collect your name, email address, phone number, and any message you provide. We do not collect payment card details directly — payments are processed through secure third-party gateways.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your information to confirm bookings and send trip-related communications, respond to enquiries, send promotional updates about upcoming trips (you may opt out at any time), and improve our website and services through anonymised analytics.',
  },
  {
    title: '3. Information Sharing',
    body: 'We do not sell, rent, or trade your personal information to third parties. We may share limited information with trip captains, accommodation partners, or transport providers solely to fulfil your booking. We may disclose information if required by law or to protect the rights and safety of our travellers.',
  },
  {
    title: '4. Cookies & Analytics',
    body: 'Our website uses cookies to remember your preferences and understand how visitors use our site. Analytics data is collected in aggregate and does not identify you personally. You can disable cookies in your browser settings, though some features may not work correctly.',
  },
  {
    title: '5. Data Retention',
    body: 'We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, and resolve any disputes. Contact form submissions are retained for up to 2 years.',
  },
  {
    title: '6. Your Rights',
    body: 'You have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data (subject to legal retention requirements), and opt out of marketing communications at any time by emailing hello@tripprchale.com.',
  },
  {
    title: '7. Security',
    body: 'We take reasonable technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse. However, no method of internet transmission is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '8. Third-Party Links',
    body: 'Our website may contain links to external websites (social media, payment gateways). We are not responsible for the privacy practices of those sites and encourage you to review their individual privacy policies.',
  },
  {
    title: '9. Children\'s Privacy',
    body: 'Our services are not directed at individuals under 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal data, please contact us immediately.',
  },
  {
    title: '10. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes acceptance of the revised policy.',
  },
  {
    title: '11. Contact Us',
    body: 'For any privacy-related questions or requests, please contact us at hello@tripprchale.com or call +91 958 941 3700. We will respond within 7 business days.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main style={{ background: 'var(--bg)', minHeight: '70vh' }}>
        {/* Hero */}
        <div style={{ background: 'var(--navy)' }} className="py-14 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Privacy Policy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">
            Last updated: June 2025
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
            At TripprChale, your privacy matters. This policy explains what personal information we
            collect, why we collect it, and how we keep it safe.
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
