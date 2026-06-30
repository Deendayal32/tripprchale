import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms & Conditions – TripprChale',
  description: 'Terms and Conditions for TripPrChale Tour & Travels.',
}

const sections = [
  {
    title: '1. The Contract',
    body: 'All persons wishing to make a booking have carefully read and understood the terms and conditions that follow. By making a booking with TripPrChale Tour & Travels or its Agents, you accept on behalf of yourself and all those named on the booking including minors and persons under a disability to be bound by these terms and conditions. A booking is accepted and becomes definite only from the date when TripPrChale sends a confirmation invoice or email. Before your booking is confirmed and a contract comes into force, TripPrChale reserves the right to increase or decrease online prices.',
  },
  {
    title: '2. Medical Conditions and Special Requirements',
    body: 'All Clients are obligated to review the Medical condition as it relates to their trip. Client must note that the nature of trips conducted by TripPrChale may be highly adventurous due to unforeseen climatic conditions and terrain. Any questions in relation to the Client\'s physical or mental suitability for a trip must be reviewed by their personal medical practitioner for approval. TripPrChale cannot offer any advice of a medical nature. Those Clients with pre-existing medical conditions are strictly advised to make reservations at their own risk.',
  },
  {
    title: '3. Travelling with Children',
    body: 'Children policy varies with the nature of trip. Trips conducted by TripPrChale are usually of adventure in nature. For reasons of safety, it is not suitable for children below 10 years to travel. Therefore, we do not encourage children reservations for families travelling with children below 10 years.',
  },
  {
    title: '4. Identification Proof',
    body: 'The Client is required to carry a valid government-approved photo ID (Indian National: PAN Card, Aadhar Card, Voters ID card, Driving Licence. Foreign National: Passport and Visa) and produce it at the time of check-in.',
  },
  {
    title: '5. Cancellation of a Tour',
    body: 'TripPrChale reserves the right to cancel any trip for any reason before departure, except for Force Majeure, unusual or unforeseen circumstances outside TripPrChale control. TripPrChale is not responsible for any incidental expenses or consequential losses that the Client may have incurred as a result of the booking.',
  },
  {
    title: '6. Unused Services',
    body: 'There will be no discounts or money refunded for missed or unused services, this includes voluntary or involuntary termination/departure from tour, i.e. sickness, death of a family member etc, late arrival on the tour, or premature departure either voluntarily or involuntarily.',
  },
  {
    title: '7. Prices, Surcharges and Taxes',
    body: 'The price of the tours published may go up or down from the time of publication. TripPrChale reserves the right to alter prices at any time prior to tour been paid in full.',
  },
  {
    title: '8. Flexibility',
    body: 'The Client understands and acknowledges that the nature of this type of travel requires considerable flexibility and should allow for reasonable alterations by TripPrChale. It is understood that the route, schedules, itineraries, amenities and mode of transport may be subject to alteration without prior notice due to local circumstances or events.',
  },
  {
    title: '9. Acceptance of Risk',
    body: 'The Client acknowledges that the nature of the tour is adventurous and may involve a significant amount of personal risk. The Client hereby assumes all such risk and does hereby release TripPrChale from all claims and causes of action arising from any damages or injuries or death resulting from these inherent risks.',
  },
  {
    title: '10. Authority on Tour',
    body: 'At all times the decision of the TripPrChale Tour Leader/Captain or representative will be final on all matters likely to endanger the safety and well-being of the tour.',
  },
  {
    title: '11. Factors Outside Control (Force Majeure)',
    body: 'TripPrChale shall not be liable in any way to the Client for death, bodily injury, illness, damage, delay or other loss or detriment to person or property, or financial costs both direct and indirect incurred, or for TripPrChale failure to commence, perform and/or complete any duty owed to the Client if such death, delay, bodily injury (including emotional distress or injury), illness, damage or other loss or detriment to person or property is caused by Act of Nature, war or war-like operations, mechanical breakdowns, terrorist activities or threat thereof, civil commotions, labor difficulties, interference by authorities, political disturbance, howsoever and where ever so ever any of the same may arise or be caused, riot, insurrection and government restraint, fire, extreme weather or any other cause whatsoever beyond the reasonable control of TripPrChale.',
  },
  {
    title: '12. Client Responsibility',
    body: 'The Client acknowledges he or she will be visiting places where the political, cultural and geographical attributes present certain risks, dangers and physical challenges greater than those present in his or her daily lives. The Client is solely responsible for acquainting themselves with customs, weather conditions, physical challenges and laws in effect at each stop along the itinerary.',
  },
  {
    title: '13. Liability',
    body: 'TripPrChale is not responsible for any improper or non-performance of any services forming part of the Contract which are wholly attributable to the fault of the passenger, the unforeseen or unavoidable act or omission of a third party unconnected with the provision of any services.',
  },
  {
    title: '14. Severability',
    body: 'In the event that any term or condition contained herein is unenforceable or void by operation of law or as being against public policy or for any other reason then such term or condition shall be deemed to be severed from this Agreement or amended accordingly only to such extent necessary to allow all remaining Terms and Conditions to survive and continue as binding.',
  },
  {
    title: '15. Successors and Assigns',
    body: 'These Terms and Conditions shall inure to the benefit of and be binding upon TripPrChale and the Client and their respective heirs, legal personal representatives, successors and assigns.',
  },
  {
    title: '16. Environment Policy',
    body: 'At TripPrChale we take in consideration the potential negative effects on the environment that the activities of our humans can cause, very seriously. We expect you to respect and meet up the environmental standards and help us maintain the prestige of the environment. Any deviation shall lead to immediate termination of the stay/contract.',
  },
  {
    title: '17. Refusal of Service',
    body: 'At any time before or during the booking process, TripPrChale retains the right to refuse service to any Client, for any reason whatsoever, outside of any discrimination or protected class reasons.',
  },
  {
    title: '18. Updating of Terms and Conditions',
    body: 'TripPrChale reserves the right to update and/or alter these terms and conditions at anytime, and it is the Client\'s responsibility to be familiar with them. The latest terms and conditions may be found on TripPrChale website. Any legal issues will be sorted out in Delhi Court only as we\'re a firm registered in Delhi.',
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
            Last updated: June 2026
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <p className="text-sm mb-10 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            These are the Terms and Conditions that will apply to your booking. Please read them
            carefully as you will be bound by them. These terms shall constitute the entire
            agreement between TripPrChale Tour &amp; Travels and the Client relating to the subject
            matter herein, and shall constitute a binding agreement.
          </p>

          <div className="space-y-8">
            {sections.map(({ title, body }) => (
              <section key={title}>
                <h2 className="text-base font-bold mb-2" style={{ color: 'var(--navy)' }}>
                  {title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-xl p-5 text-sm"
            style={{ background: 'rgba(27,42,74,0.05)', border: '1px solid rgba(27,42,74,0.1)' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              For any questions, please contact us at{' '}
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
