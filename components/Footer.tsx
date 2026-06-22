import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

// Inline SVG social icons (lucide-react version doesn't include these)
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
)

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.75)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/IMG_9734.PNG"
              alt="TripprChale"
              width={44}
              height={44}
              className="rounded-full object-contain"
              style={{ background: 'white', padding: '2px' }}
            />
            <div>
              <div className="font-black text-sm tracking-wide">
                <span style={{ color: 'var(--primary)' }}>TRIP</span><span style={{ color: 'rgba(255,255,255,0.75)' }}>PR</span><span style={{ color: 'var(--sky)' }}>CHALE</span>
              </div>
              <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Where Memories Are Made!!
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-5">
            India's favourite youth group travel community. Affordable, fun, and unforgettable adventures since 2022.
          </p>
          <div className="flex gap-3">
            {[
              { href: 'https://www.instagram.com/tripprchale?igsh=OWV1czhwYThvZW11&utm_source=qr', icon: <IconInstagram />, label: 'Instagram' },
              { href: 'https://www.facebook.com/share/18tcgWa4ng/?mibextid=wwXIfr',              icon: <IconFacebook />,  label: 'Facebook'  },
              { href: 'https://www.youtube.com/@Tripprchale',                                    icon: <IconYoutube />,   label: 'YouTube'   },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Upcoming Trips',    href: '/#trips' },
              { label: 'Weekend Getaways',  href: '/?category=weekend#trips' },
              { label: 'Backpacking Tours', href: '/?category=backpacking#trips' },
              { label: 'Himalayan Treks',   href: '/?category=himalayan#trips' },
              { label: 'Custom Tours',      href: '/#contact' },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="hover:text-white transition-colors hover:pl-1"
                  style={{ display: 'inline-block' }}
                >
                  → {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Destinations */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Popular Destinations</h4>
          <ul className="space-y-2 text-sm">
            {['Kasol & Manali', 'Rajasthan', 'Goa', 'Ladakh', 'Spiti Valley', 'Kerala', 'Bali', 'Thailand'].map((dest) => (
              <li key={dest}>
                <span
                  className="hover:text-white transition-colors cursor-pointer"
                  style={{ display: 'inline-block' }}
                >
                  📍 {dest}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
              <a href="tel:+919589413700" className="hover:text-white transition-colors">
                +91 958 941 3700
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
              <a href="mailto:hello@tripprchale.com" className="hover:text-white transition-colors">
                hello@tripprchale.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
              <span>New Delhi, India</span>
            </li>
          </ul>

          <div className="mt-5 p-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <p className="text-white font-semibold mb-1">💬 WhatsApp Us</p>
            <a
              href="https://wa.me/919717096999?text=Hi%20TripprChale!%20I%20want%20to%20check%20seat%20availability."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-white transition-colors"
              style={{ color: '#25D366' }}
            >
              +91 971 709 6999 →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t text-center py-5 text-xs"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
      >
        © {new Date().getFullYear()} TripprChale.com · All rights reserved ·{' '}
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        {' · '}
        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
      </div>
    </footer>
  )
}
