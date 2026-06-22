export type Batch = {
  batchId: string
  departureDate: string  // YYYY-MM-DD
  seatsLeft: number
  status: 'Available' | 'Filling Fast' | 'Last Few Seats'
}

export type Trip = {
  id: number
  name: string
  destination: string
  category: 'weekend' | 'backpacking' | 'himalayan' | 'international'
  startDate: string    // YYYY-MM-DD (earliest upcoming batch)
  endDate: string      // YYYY-MM-DD
  price: number
  originalPrice?: number
  seatsLeft: number
  totalSeats: number
  image: string
  emoji: string
  badge: string
  badgeColor: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  highlights: string[]
  includes: string[]
  duration: string       // e.g. "5 Days / 4 Nights"
  durationBadge: string  // e.g. "5D / 4N"
  batches: Batch[]
}

export const upcomingTrips: Trip[] = [
  // ── Blueprint hero trips (June 2026) ──────────────────────────────────
  {
    id: 1,
    name: 'Kasol Manali Adventure',
    destination: 'Kasol & Manali',
    category: 'himalayan',
    startDate: '2026-06-19',
    endDate: '2026-06-23',
    price: 9999,
    seatsLeft: 12,
    totalSeats: 25,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
    emoji: '⛰️',
    badge: 'HIMALAYAN',
    badgeColor: '#1B2A4A',
    difficulty: 'Moderate',
    highlights: ['Kheerganga Trek', 'Manali Mall Road', 'Rohtang Pass', 'Kullu River Rafting'],
    includes: ['Hotel / Homestay', 'Transport', 'Trip captain', 'Breakfast'],
    duration: '5 Days / 4 Nights',
    durationBadge: '5D / 4N',
    batches: [
      { batchId: 'B-JUN-19', departureDate: '2026-06-19', seatsLeft: 12, status: 'Filling Fast' },
      { batchId: 'B-JUN-26', departureDate: '2026-06-26', seatsLeft: 8,  status: 'Last Few Seats' },
      { batchId: 'B-JUL-03', departureDate: '2026-07-03', seatsLeft: 20, status: 'Available' },
    ],
  },
  {
    id: 2,
    name: 'Rajasthan Royal Escapade',
    destination: 'Jaisalmer & Jodhpur',
    category: 'backpacking',
    startDate: '2026-06-20',
    endDate: '2026-06-24',
    price: 9999,
    originalPrice: 13999,
    seatsLeft: 15,
    totalSeats: 30,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed68b1e?w=700&q=80',
    emoji: '🏜️',
    badge: 'HOT DEAL',
    badgeColor: '#FF914D',
    difficulty: 'Easy',
    highlights: ['Desert Safari', 'Jaisalmer Fort', 'Camel Ride', 'Blue City Jodhpur'],
    includes: ['Hotel stays', 'Transport', 'Trip captain', 'Breakfast'],
    duration: '5 Days / 4 Nights',
    durationBadge: '5D / 4N',
    batches: [
      { batchId: 'B-JUN-20', departureDate: '2026-06-20', seatsLeft: 15, status: 'Available' },
      { batchId: 'B-JUN-27', departureDate: '2026-06-27', seatsLeft: 10, status: 'Filling Fast' },
      { batchId: 'B-JUL-04', departureDate: '2026-07-04', seatsLeft: 25, status: 'Available' },
    ],
  },
  {
    id: 3,
    name: 'Goa Beach Backpacking',
    destination: 'Goa',
    category: 'backpacking',
    startDate: '2026-06-24',
    endDate: '2026-06-28',
    price: 9999,
    originalPrice: 12999,
    seatsLeft: 18,
    totalSeats: 30,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=80',
    emoji: '🌊',
    badge: 'BEACH VIBES',
    badgeColor: '#00C2FF',
    difficulty: 'Easy',
    highlights: ['Baga Beach Party', 'Old Goa Churches', 'Dudhsagar Falls', 'Flea Markets'],
    includes: ['Hostel / Hotel', 'Transport', 'Trip captain'],
    duration: '5 Days / 4 Nights',
    durationBadge: '5D / 4N',
    batches: [
      { batchId: 'B-JUN-24', departureDate: '2026-06-24', seatsLeft: 18, status: 'Available' },
      { batchId: 'B-JUN-30', departureDate: '2026-06-30', seatsLeft: 12, status: 'Filling Fast' },
      { batchId: 'B-JUL-07', departureDate: '2026-07-07', seatsLeft: 28, status: 'Available' },
    ],
  },

  // ── Weekend Getaways ────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Coorg Coffee Trail',
    destination: 'Coorg',
    category: 'weekend',
    startDate: '2026-06-21',
    endDate: '2026-06-23',
    price: 6499,
    seatsLeft: 8,
    totalSeats: 20,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=700&q=80',
    emoji: '☕',
    badge: 'WEEKEND',
    badgeColor: '#795548',
    difficulty: 'Easy',
    highlights: ['Coffee Plantation Walk', 'Abbey Falls', "Raja's Seat", 'Tibetan Monastery'],
    includes: ['Homestay', 'Transport', 'Trip captain', 'Meals'],
    duration: '3 Days / 2 Nights',
    durationBadge: '3D / 2N',
    batches: [
      { batchId: 'B-JUN-21', departureDate: '2026-06-21', seatsLeft: 8,  status: 'Filling Fast' },
      { batchId: 'B-JUN-28', departureDate: '2026-06-28', seatsLeft: 15, status: 'Available' },
      { batchId: 'B-JUL-05', departureDate: '2026-07-05', seatsLeft: 20, status: 'Available' },
    ],
  },
  {
    id: 5,
    name: 'Rishikesh River Rush',
    destination: 'Rishikesh',
    category: 'weekend',
    startDate: '2026-06-28',
    endDate: '2026-06-30',
    price: 5499,
    seatsLeft: 3,
    totalSeats: 20,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=700&q=80',
    emoji: '🚣',
    badge: 'ADVENTURE',
    badgeColor: '#FF914D',
    difficulty: 'Moderate',
    highlights: ['White Water Rafting', 'Bungee Jumping', 'Beatles Ashram', 'Camping by Ganga'],
    includes: ['Camp stay', 'Transport', 'Trip captain', 'Meals'],
    duration: '3 Days / 2 Nights',
    durationBadge: '3D / 2N',
    batches: [
      { batchId: 'B-JUN-28', departureDate: '2026-06-28', seatsLeft: 3,  status: 'Last Few Seats' },
      { batchId: 'B-JUL-05', departureDate: '2026-07-05', seatsLeft: 12, status: 'Available' },
      { batchId: 'B-JUL-12', departureDate: '2026-07-12', seatsLeft: 18, status: 'Available' },
    ],
  },

  // ── Himalayan Treks ─────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Spiti Valley Expedition',
    destination: 'Spiti Valley',
    category: 'himalayan',
    startDate: '2026-07-05',
    endDate: '2026-07-12',
    price: 18999,
    seatsLeft: 9,
    totalSeats: 18,
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=700&q=80',
    emoji: '🏔️',
    badge: 'OFFBEAT',
    badgeColor: '#795548',
    difficulty: 'Challenging',
    highlights: ['Key Monastery', 'Chandratal Lake', 'Pin Valley', 'Kaza Market'],
    includes: ['Hotel / Homestay', 'Transport', 'Trip captain', 'All meals'],
    duration: '8 Days / 7 Nights',
    durationBadge: '8D / 7N',
    batches: [
      { batchId: 'B-JUL-05', departureDate: '2026-07-05', seatsLeft: 9,  status: 'Filling Fast' },
      { batchId: 'B-JUL-19', departureDate: '2026-07-19', seatsLeft: 14, status: 'Available' },
      { batchId: 'B-AUG-02', departureDate: '2026-08-02', seatsLeft: 18, status: 'Available' },
    ],
  },
  {
    id: 7,
    name: 'Ladakh High Altitude Trek',
    destination: 'Ladakh',
    category: 'himalayan',
    startDate: '2026-07-18',
    endDate: '2026-07-25',
    price: 25999,
    originalPrice: 30999,
    seatsLeft: 4,
    totalSeats: 20,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
    emoji: '🧊',
    badge: 'EXPEDITION',
    badgeColor: '#1B2A4A',
    difficulty: 'Challenging',
    highlights: ['Pangong Lake', 'Nubra Valley', 'Khardung La Pass', 'Magnetic Hill'],
    includes: ['Hotel stays', 'Transport', 'Trip captain', 'Breakfast'],
    duration: '8 Days / 7 Nights',
    durationBadge: '8D / 7N',
    batches: [
      { batchId: 'B-JUL-18', departureDate: '2026-07-18', seatsLeft: 4,  status: 'Last Few Seats' },
      { batchId: 'B-AUG-01', departureDate: '2026-08-01', seatsLeft: 11, status: 'Available' },
      { batchId: 'B-AUG-15', departureDate: '2026-08-15', seatsLeft: 20, status: 'Available' },
    ],
  },

  // ── International ───────────────────────────────────────────────────────
  {
    id: 8,
    name: 'Thailand Beach Escape',
    destination: 'Thailand',
    category: 'international',
    startDate: '2026-07-10',
    endDate: '2026-07-17',
    price: 24999,
    originalPrice: 30999,
    seatsLeft: 8,
    totalSeats: 25,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=700&q=80',
    emoji: '🏖️',
    badge: 'INTERNATIONAL',
    badgeColor: '#7C5CBF',
    difficulty: 'Easy',
    highlights: ['Phi Phi Islands', 'Bangkok Street Food', 'Tiger Temple', 'Floating Market'],
    includes: ['Hotel stays', 'Flights', 'Transport', 'Trip captain', 'Breakfast'],
    duration: '8 Days / 7 Nights',
    durationBadge: '8D / 7N',
    batches: [
      { batchId: 'B-JUL-10', departureDate: '2026-07-10', seatsLeft: 8,  status: 'Filling Fast' },
      { batchId: 'B-AUG-07', departureDate: '2026-08-07', seatsLeft: 18, status: 'Available' },
      { batchId: 'B-SEP-04', departureDate: '2026-09-04', seatsLeft: 25, status: 'Available' },
    ],
  },
  {
    id: 9,
    name: 'Bali Spiritual Retreat',
    destination: 'Bali',
    category: 'international',
    startDate: '2026-08-05',
    endDate: '2026-08-12',
    price: 32999,
    seatsLeft: 6,
    totalSeats: 20,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80',
    emoji: '🌺',
    badge: 'PARADISE',
    badgeColor: '#E91E8C',
    difficulty: 'Easy',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Uluwatu Sunset', 'Seminyak Beach'],
    includes: ['Villa stays', 'Flights', 'Transport', 'Trip captain'],
    duration: '8 Days / 7 Nights',
    durationBadge: '8D / 7N',
    batches: [
      { batchId: 'B-AUG-05', departureDate: '2026-08-05', seatsLeft: 6,  status: 'Last Few Seats' },
      { batchId: 'B-SEP-03', departureDate: '2026-09-03', seatsLeft: 14, status: 'Available' },
    ],
  },
  {
    id: 10,
    name: 'Vietnam Cultural Journey',
    destination: 'Vietnam',
    category: 'international',
    startDate: '2026-09-10',
    endDate: '2026-09-17',
    price: 27999,
    seatsLeft: 14,
    totalSeats: 25,
    image: 'https://images.unsplash.com/photo-1552832046-3d46fd96f1f7?w=700&q=80',
    emoji: '🌿',
    badge: 'NEW',
    badgeColor: '#4CAF50',
    difficulty: 'Easy',
    highlights: ['Ha Long Bay', 'Hoi An Lanterns', 'Ho Chi Minh City', 'Mekong Delta'],
    includes: ['Hotel stays', 'Flights', 'Transport', 'Trip captain', 'Breakfast'],
    duration: '8 Days / 7 Nights',
    durationBadge: '8D / 7N',
    batches: [
      { batchId: 'B-SEP-10', departureDate: '2026-09-10', seatsLeft: 14, status: 'Available' },
      { batchId: 'B-OCT-08', departureDate: '2026-10-08', seatsLeft: 25, status: 'Available' },
    ],
  },
]

// ── Helper: get departure month/year key ────────────────────────────────────
export function getBatchMonthKey(batch: Batch): string {
  const [y, m] = batch.departureDate.split('-').map(Number)
  return `${y}-${String(m).padStart(2, '0')}`
}

// ── Helper: format date for display ─────────────────────────────────────────
export function formatBatchDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}
