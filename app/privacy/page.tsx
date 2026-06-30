import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy – TripprChale',
  description: 'Privacy Policy for TripPrChale Tour & Travels.',
}

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
            Last updated: June 2026
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">

          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            The terms <strong>&quot;We&quot;</strong> / <strong>&quot;Us&quot;</strong> /{' '}
            <strong>&quot;Our&quot;</strong> / <strong>&quot;Company&quot;</strong> individually and
            collectively refer to TripPrChale Tour &amp; Travels and the terms{' '}
            <strong>&quot;You&quot;</strong> / <strong>&quot;Your&quot;</strong> /{' '}
            <strong>&quot;Yourself&quot;</strong> refer to the users.
          </p>

          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            This privacy policy is a legally binding document between you and TripPrChale. The terms
            of this privacy policy will be effective upon your acceptance of the same (directly or
            indirectly in electronic form, by clicking on the I accept tab or book now or by use of
            the website or by other means) and will govern the relationship between you and
            TripPrChale for your use of the website &quot;www.tripprchale.com&quot;.
          </p>

          <p className="text-sm mb-10 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Please read this privacy policy carefully, by using the website you indicate that you
            understand, agree and consent to this privacy policy. If you do not agree with the terms
            of this privacy policy, we request you to please do not use this website.
          </p>

          <div className="space-y-8">

            <section>
              <h2 className="text-base font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--navy)' }}>
                Introduction
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                The privacy policy is an online document that makes sure a user&apos;s online
                information is protected and it is not used for anything that intends them any harm.
                All the pointers given under our privacy policy are valid under the Information
                Technology Act, 2000. This document is updated from time to time by TripPrChale for
                the betterment of the same. The current version of the privacy policy is updated on
                June 2026.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--navy)' }}>
                Declaration
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                TripPrChale declares that we are not going to use any user information whatsoever in
                bad faith and/or sell the information to any third party under any condition. But if
                necessary and in case a legal notice is served to us by any court or governmental
                agency or authority for the purpose of verification of identity, or for the
                prevention, detection, investigation including cyber incidents, or for prosecution
                and punishment of offenses, whatsoever it may be, we&apos;re going to share the user
                information under the Right to Informations Act. Additionally, any legal issues will
                be sorted out in Delhi Court only as we&apos;re a firm operating from Delhi.
              </p>
              <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                If required the Client must complete the verification/medical form honestly,
                accurately and disclose all medical history and information, if required. TripPrChale
                will review the information submitted, and keep the information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--navy)' }}>
                Website Privacy
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Our website is standing there for providing services to the users and in order to
                that, we may ask you for your information at times. We assure you that all the
                information that is gathered from you is being used for facilitation purposes only
                and not for any malicious activity. We do not encourage data leaks or any similar
                schemes, which is why your information will be kept protected and only be shared
                with the members of the company who are associated with the facilitation of service
                for the user only.
              </p>
            </section>

          </div>

          {/* Contact */}
          <div className="mt-10 rounded-xl p-5 text-sm"
            style={{ background: 'rgba(27,42,74,0.05)', border: '1px solid rgba(27,42,74,0.1)' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              For any privacy-related questions, please contact us at{' '}
              <a href="mailto:tripprchaleofficial@gmail.com"
                style={{ color: 'var(--primary)', fontWeight: 600 }}>
                tripprchaleofficial@gmail.com
              </a>{' '}
              or call{' '}
              <a href="tel:+918448622890" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                +91 84486 22890
              </a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
