import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import BrandName from '@/components/BrandName'

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
)

const COL_HEAD = 'font-semibold text-xs uppercase tracking-widest mb-5 pb-2'
const COL_HEAD_STYLE = { color: 'white', borderBottom: '1px solid rgba(255,255,255,0.12)' }

const weekendTrips = [
  { label: 'Chopta Tungnath',      search: 'Chopta'     },
  { label: 'Manali Sissu',         search: 'Manali'     },
  { label: 'Kasol Kheerganga',     search: 'Kasol'      },
  { label: 'Jibhi & Tirthan Valley', search: 'Jibhi'   },
  { label: 'McLeodganj Triund',    search: 'McLeodganj' },
]

const backpackingTrips = [
  { label: 'Spiti Valley',         search: 'Spiti'      },
  { label: 'Leh & Ladakh',         search: 'Ladakh'     },
  { label: 'Rajasthan Royal',      search: 'Rajasthan'  },
  { label: 'Goa Beach Tour',       search: 'Goa'        },
  { label: 'Meghalaya Adventure',  search: 'Meghalaya'  },
]

const quickLinks = [
  { label: 'Upcoming Trips',              href: '/#trips'                       },
  { label: 'Weekend Getaways',            href: '/?category=weekend#trips'      },
  { label: 'Backpacking Tours',           href: '/?category=backpacking#trips'  },
  { label: 'Custom Tours',               href: '/#contact'                     },
  { label: 'Cancellation & Refund Policy', href: '/terms'                      },
  { label: 'Privacy Policy & Terms',     href: '/privacy'                      },
]

const paymentBadges = ['VISA', 'Mastercard', 'RuPay', 'UPI']

export default function Footer() {
  return (
    <footer style={{ background: '#1B2A4A', color: 'rgba(255,255,255,0.68)', fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">

        {/* ── Col 1: Brand ── */}
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/IMG_9734.PNG"
              alt="TripprChale"
              width={46}
              height={46}
              className="rounded-full object-contain shrink-0"
              style={{ background: 'white', padding: '2px' }}
            />
            <div>
              <div className="font-black text-base tracking-wide leading-none">
                <span style={{ color: '#FF914D' }}>TRIP</span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>PR</span>
                <span style={{ color: '#29ABE2' }}>CHALE</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Where Memories Are Made!!
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            India&apos;s favourite youth group travel community. Affordable, fun, and unforgettable adventures since 2022.
          </p>

          <div className="flex gap-2.5">
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
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Col 2: Weekend Trips ── */}
        <div>
          <h4 className={COL_HEAD} style={COL_HEAD_STYLE}>Weekend Trips</h4>
          <ul className="space-y-2.5">
            {weekendTrips.map(({ label, search }) => (
              <li key={label}>
                <Link
                  href={`/?category=weekend&search=${encodeURIComponent(search)}#trips`}
                  className="text-sm flex items-center gap-2 transition-all hover:text-white hover:translate-x-1"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  <span style={{ color: '#FF914D', fontSize: '10px' }}>▶</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Backpacking & Treks ── */}
        <div>
          <h4 className={COL_HEAD} style={COL_HEAD_STYLE}>Backpacking &amp; Treks</h4>
          <ul className="space-y-2.5">
            {backpackingTrips.map(({ label, search }) => (
              <li key={label}>
                <Link
                  href={`/?category=backpacking&search=${encodeURIComponent(search)}#trips`}
                  className="text-sm flex items-center gap-2 transition-all hover:text-white hover:translate-x-1"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  <span style={{ color: '#FF914D', fontSize: '10px' }}>▶</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 4: Quick Links ── */}
        <div>
          <h4 className={COL_HEAD} style={COL_HEAD_STYLE}>Quick Links</h4>
          <ul className="space-y-2.5">
            {quickLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm flex items-center gap-2 transition-all hover:text-white hover:translate-x-1"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  <span style={{ color: '#FF914D', fontSize: '10px' }}>▶</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 5: Contact ── */}
        <div>
          <h4 className={COL_HEAD} style={COL_HEAD_STYLE}>Our Presence &amp; Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: '#FF914D' }} />
              <div>
                <div className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Registered Office</div>
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Shop No. 56, 2nd Floor, Neelam Flyover Market, NIT Faridabad, Haryana – 121001
                </span>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <Phone size={14} className="mt-0.5 shrink-0" style={{ color: '#FF914D' }} />
              <div className="flex flex-col gap-0.5">
                <div className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Call Us</div>
                <a href="tel:+918448622890" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>+91 84486 22890</a>
                <a href="tel:+919136090840" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>+91 91360 90840</a>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <Mail size={14} className="mt-0.5 shrink-0" style={{ color: '#FF914D' }} />
              <div>
                <div className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Email</div>
                <a href="mailto:tripprchaleofficial@gmail.com"
                  className="hover:text-white transition-colors break-all"
                  style={{ color: 'rgba(255,255,255,0.65)' }}>
                  tripprchaleofficial@gmail.com
                </a>
              </div>
            </li>
          </ul>

          {/* WhatsApp button */}
          <a
            href="https://wa.me/918448622890?text=Hi%20TripprChale!%20I%20want%20to%20check%20seat%20availability."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-all hover:scale-105"
            style={{ background: '#25D366', color: '#fff' }}
          >
            <MessageCircle size={15} />
            WhatsApp: +91 84486 22890
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="text-xs text-center sm:text-left" style={{ color: 'rgba(255,255,255,0.38)' }}>
            © {new Date().getFullYear()} <BrandName dark />.com &nbsp;·&nbsp; All rights reserved
          </p>

          {/* Payment trust badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs mr-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Secure payments via</span>
            {paymentBadges.map(name => (
              <span
                key={name}
                className="text-xs font-bold px-2.5 py-1 rounded"
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.03em',
                  fontFamily: 'sans-serif',
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
