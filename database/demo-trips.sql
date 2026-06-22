-- ── TripprChale — Demo Trips Seed ──────────────────────────────────────────
-- Run: mysql -u root -pAsdf@1234 tripprchalo < database/demo-trips.sql

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE batches;
TRUNCATE TABLE trips;
SET FOREIGN_KEY_CHECKS = 1;

-- ── 10 Demo Trips ──────────────────────────────────────────────────────────
INSERT INTO trips
  (slug, name, tagline, destination, country, category,
   startDate, endDate, duration, durationOptions,
   price, originalPrice, seatsLeft, totalSeats,
   image, gallery, emoji, badge, badgeColor, difficulty,
   highlights, itinerary, includes, excludes,
   rating, reviewCount, featured)
VALUES

-- 1. Kasol Kheerganga Trek (backpacking)
(
  'kasol-kheerganga-trek',
  'Kasol Kheerganga Trek',
  'Trek through pine forests to natural hot springs in Parvati Valley',
  'Kasol, Himachal Pradesh', 'India', 'backpacking',
  '2026-07-04', '2026-07-08', '5 Days / 4 Nights',
  JSON_ARRAY('5D/4N','4D/3N'),
  5999, 7499, 18, 25,
  'https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80'
  ),
  '🏔️', 'Bestseller', '#FF6B35', 'Moderate',
  JSON_ARRAY('Natural hot spring dip at Kheerganga','Riverside camping along Parvati River','Parvati Valley panoramic views','Night bonfire & music','Waterfall & meadow walk'),
  JSON_ARRAY('Day 1: Overnight bus Delhi → Bhuntar','Day 2: Bhuntar → Kasol, explore village & Chalal forest','Day 3: Trek Kasol → Kheerganga (12 km through pine forests)','Day 4: Hot springs morning, descend to Kasol','Day 5: Kasol → Delhi bus'),
  JSON_ARRAY('AC Volvo bus Delhi–Bhuntar–Delhi','All accommodation (hostel + forest camps)','Meals: Day 2 breakfast through Day 4 dinner','Certified trek leader & safety guide','First-aid kit','Bonfire & cultural evenings'),
  JSON_ARRAY('Personal expenses & tips','Travel insurance','Anything not listed above'),
  4.8, 312, 1
),

-- 2. Manali Weekend Escape (weekend)
(
  'manali-weekend-escape',
  'Manali Weekend Escape',
  'Mountains, snow peaks and cafés — the perfect long weekend getaway',
  'Manali, Himachal Pradesh', 'India', 'weekend',
  '2026-07-10', '2026-07-13', '4 Days / 3 Nights',
  JSON_ARRAY('4D/3N','3D/2N'),
  7499, 9499, 14, 20,
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1609766857671-5c2b244e1d75?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
  ),
  '🏔️', 'Popular', '#29ABE2', 'Easy',
  JSON_ARRAY('Rohtang Pass snowfields','Solang Valley adventure sports','Old Manali café-hopping','Hadimba Devi Temple','Beas River views'),
  JSON_ARRAY('Day 1: Overnight Volvo from Delhi → Manali','Day 2: Manali city tour — Old Manali, Hadimba, Mall Road','Day 3: Rohtang Pass / Solang Valley day trip','Day 4: Leisure morning, return Volvo to Delhi'),
  JSON_ARRAY('Volvo bus Delhi–Manali–Delhi','Hotel twin sharing 3 nights','Breakfast & dinner all days','Rohtang permit & vehicle','Local guided sightseeing'),
  JSON_ARRAY('Lunch','Optional adventure activities (zip-line, ATV)','Personal expenses'),
  4.7, 528, 1
),

-- 3. Kedarkantha Summit Trek (himalayan)
(
  'kedarkantha-summit-trek',
  'Kedarkantha Summit Trek',
  'Stand atop one of Uttarakhand\'s most beautiful Himalayan peaks',
  'Sankri, Uttarakhand', 'India', 'himalayan',
  '2026-08-01', '2026-08-07', '7 Days / 6 Nights',
  JSON_ARRAY('7D/6N'),
  8999, 11499, 16, 22,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80'
  ),
  '🏔️', 'Thrilling', '#8B5CF6', 'Moderate',
  JSON_ARRAY('12,500 ft summit with 360° Himalayan views','Juda-ka-Talab pristine alpine lake','Snow-covered meadows & oak forests','Sunrise from the summit','Sankri village cultural experience'),
  JSON_ARRAY('Day 1: Dehradun pickup → Sankri (7 hrs drive)','Day 2: Acclimatisation hike around Sankri village','Day 3: Trek Sankri → Juda-ka-Talab (6 km, 3 hrs)','Day 4: Juda-ka-Talab → Kedarkantha Base (4 km)','Day 5: Summit push & descend to Sankri (10 km, thrilling!)','Day 6: Rest & leisure at Sankri, local exploration','Day 7: Sankri → Dehradun drop'),
  JSON_ARRAY('All meals from Day 1 dinner to Day 7 breakfast','Tent accommodation (2-person sharing)','Experienced Himalayan trek leader','Porters for group equipment','Safety & first-aid gear','Transport Dehradun–Sankri–Dehradun'),
  JSON_ARRAY('Personal trekking gear & poles','Travel insurance','Sleeping bag (available on rent ₹300/night)','Extra snacks & energy bars'),
  4.9, 187, 1
),

-- 4. Rishikesh Adventure Weekend (weekend)
(
  'rishikesh-adventure-weekend',
  'Rishikesh Adventure Weekend',
  'White-water rafting, bungee jump & yoga — Rishikesh in 3 days',
  'Rishikesh, Uttarakhand', 'India', 'weekend',
  '2026-07-17', '2026-07-19', '3 Days / 2 Nights',
  JSON_ARRAY('3D/2N','2D/1N'),
  4999, 6499, 22, 30,
  'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80',
    'https://images.unsplash.com/photo-1609148977791-4e3d3f7b0fbd?w=600&q=80'
  ),
  '🌊', 'Adventure', '#FF6B35', 'Easy',
  JSON_ARRAY('Grade III–IV white-water Ganga rafting','Laxman Jhula & Ram Jhula walks','Evening Ganga Aarti at the ghats','Sunrise yoga session','Tapovan café scene'),
  JSON_ARRAY('Day 1: Delhi → Rishikesh (Tempo Traveller), Laxman Jhula walk, Ganga Aarti','Day 2: Rafting (Shivpuri → Nim Beach 16 km), cliff jumping, bungee (optional)','Day 3: Sunrise yoga, waterfall trek, depart to Delhi post lunch'),
  JSON_ARRAY('Tempo Traveller Delhi–Rishikesh–Delhi','Riverside camp accommodation (2 nights)','Meals: Day 1 dinner to Day 3 lunch','White-water rafting with certified guide & safety gear','Life jackets & helmets'),
  JSON_ARRAY('Bungee jump (optional add-on ₹3,500)','Flying fox & giant swing','Personal expenses & tips'),
  4.6, 743, 1
),

-- 5. Bali Tropical Escape (international)
(
  'bali-tropical-escape',
  'Bali Tropical Escape',
  'Temples, rice terraces and pristine beaches in Island Paradise',
  'Bali, Indonesia', 'Indonesia', 'international',
  '2026-08-15', '2026-08-22', '8 Days / 7 Nights',
  JSON_ARRAY('8D/7N','6D/5N'),
  34999, 44999, 12, 18,
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80',
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80'
  ),
  '🌴', 'Hot Deal', '#FF8C42', 'Easy',
  JSON_ARRAY('Tanah Lot & Uluwatu sunset temples','Tegalalang rice terrace walk','Mount Batur sunrise trek (4am!)','Ubud monkey forest & arts market','Balinese cooking class','Seminyak beach club'),
  JSON_ARRAY('Day 1: Fly Delhi → Denpasar (connection)','Day 2: Arrive Bali, Ubud — monkey forest, rice terraces','Day 3: Mount Batur sunrise trek, hot spring soak','Day 4: Ubud temples, cooking class, art market','Day 5: Transfer Seminyak — beach club, Tanah Lot sunset','Day 6: Uluwatu temple, Kecak fire dance, Jimbaran seafood dinner','Day 7: Free beach day & shopping','Day 8: Depart Bali → Delhi'),
  JSON_ARRAY('Return economy flights Delhi–Bali','4-star hotel twin sharing (7 nights)','Daily breakfast','All airport transfers & sightseeing (AC van)','English-speaking local guide','Temple tickets & cooking class','Visa on arrival assistance'),
  JSON_ARRAY('Lunch & dinner (except cooking class)','Personal shopping','Optional adventure (ATV, white water)','Travel insurance'),
  4.8, 234, 1
),

-- 6. Spiti Valley Road Trip (himalayan)
(
  'spiti-valley-road-trip',
  'Spiti Valley Road Trip',
  'Cold desert monasteries, high-altitude lakes and forgotten villages',
  'Spiti Valley, Himachal Pradesh', 'India', 'himalayan',
  '2026-09-05', '2026-09-13', '9 Days / 8 Nights',
  JSON_ARRAY('9D/8N'),
  14999, 18999, 10, 16,
  'https://images.unsplash.com/photo-1600001706039-d6a64cf0c7e2?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1567745576352-4b2f7f16e1e8?w=600&q=80',
    'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80'
  ),
  '🏜️', 'Exclusive', '#2DBFBB', 'Moderate',
  JSON_ARRAY('Key Monastery at 13,668 ft','Chandratal Lake overnight camping','Hikkim — world\'s highest post office','Kibber village at 14,200 ft','Kunzum Pass (15,060 ft)','Spiti River valleys'),
  JSON_ARRAY('Day 1: Shimla → Narkanda (acclimatise)','Day 2: Narkanda → Reckong Peo','Day 3: Reckong Peo → Nako Lake village','Day 4: Nako → Tabo Monastery → Dhankar','Day 5: Dhankar → Pin Valley → Kaza','Day 6: Kaza — Key, Kibber, Langza & Komic villages','Day 7: Kaza → Chandratal Lake (camp under stars)','Day 8: Chandratal → Manali via Kunzum & Rohtang','Day 9: Manali departure'),
  JSON_ARRAY('Tempo Traveller with driver-guide throughout','All accommodation — hotels & camps','Breakfast & dinner all days','Oxygen cylinder in vehicle','Inner Line Permit (restricted area)','All fuel & toll charges'),
  JSON_ARRAY('Shimla/Manali arrival travel','Lunch during transit','Personal expenses','Helicopter evacuation (if needed)'),
  4.9, 98, 1
),

-- 7. Hampi Backpacker Trail (backpacking)
(
  'hampi-backpacker-trail',
  'Hampi Backpacker Trail',
  'Ancient ruins, bouldering paradise and legendary chill vibes',
  'Hampi, Karnataka', 'India', 'backpacking',
  '2026-08-08', '2026-08-12', '5 Days / 4 Nights',
  JSON_ARRAY('5D/4N','3D/2N'),
  5499, 7299, 20, 28,
  'https://images.unsplash.com/photo-1582531267737-e2ed0e27e39f?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1600100397608-c8a21a7339c5?w=600&q=80',
    'https://images.unsplash.com/photo-1590418606746-018840f9ced0?w=600&q=80'
  ),
  '🏛️', 'Heritage Pick', '#FFD15C', 'Easy',
  JSON_ARRAY('Virupaksha Temple sunrise climb','Vittala Temple & stone chariot','Coracle boat ride on Tungabhadra','Hippie Island sunset session','Hemakuta Hill boulder trail','Sunset from Matanga Hill'),
  JSON_ARRAY('Day 1: Overnight train/bus from Bangalore','Day 2: Arrive Hampi, Virupaksha Temple, Hemakuta Hill, sunset','Day 3: Royal Centre — Lotus Mahal, elephant stables, queen\'s bath','Day 4: Vittala Temple, coracle ride, Hippie Island chill','Day 5: Morning bouldering, souvenir market, return journey'),
  JSON_ARRAY('Sleeper bus/train Bangalore–Hampi–Bangalore','Hostel accommodation (twin or dorm)','Daily breakfast','Guided heritage walk on Day 2','Coracle ride ticket','Archaeological site entry fees'),
  JSON_ARRAY('Lunch & dinner','Bouldering instructor (optional)','Personal expenses'),
  4.7, 156, 0
),

-- 8. Thailand Group Tour (international)
(
  'thailand-group-tour',
  'Thailand Group Tour',
  'Bangkok temples, Phuket beaches and Chiang Mai jungle culture',
  'Bangkok · Phuket · Chiang Mai', 'Thailand', 'international',
  '2026-09-18', '2026-09-27', '10 Days / 9 Nights',
  JSON_ARRAY('10D/9N'),
  49999, 64999, 8, 16,
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1598430772299-8c0b2df9b32c?w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80'
  ),
  '🇹🇭', 'New', '#FF6B35', 'Easy',
  JSON_ARRAY('Grand Palace & Wat Pho, Bangkok','Phi Phi Island speedboat tour','Ethical elephant sanctuary Chiang Mai','Thai street food crawl','Floating market experience','Doi Inthanon — Thailand\'s highest peak'),
  JSON_ARRAY('Day 1: Fly Delhi → Bangkok','Day 2: Grand Palace, Wat Pho, Tuk-Tuk tour','Day 3: Floating market, Jim Thompson House, Khao San Road','Day 4: Fly Bangkok → Phuket','Day 5: Phi Phi Island full day tour','Day 6: Phang Nga Bay — James Bond Island','Day 7: Fly Phuket → Chiang Mai','Day 8: Elephant sanctuary & Old City temples','Day 9: Doi Inthanon, Night Bazaar','Day 10: Fly Chiang Mai → Delhi'),
  JSON_ARRAY('Return economy flights (Delhi→Bangkok→Phuket→Chiang Mai→Delhi)','3-4 star hotels twin sharing (9 nights)','Daily breakfast','All intercity flights within Thailand','AC coach transfers','Elephant sanctuary entry','Grand Palace & temple tickets','Phi Phi Island speedboat tour'),
  JSON_ARRAY('Thai visa fee (~₹2,500)','Lunch & dinner','Personal shopping','Travel insurance (mandatory)'),
  4.8, 89, 1
),

-- 9. Coorg Coffee Trail (weekend)
(
  'coorg-coffee-trail',
  'Coorg Coffee Trail',
  'Green hills, misty waterfalls and the aroma of fresh coffee',
  'Coorg, Karnataka', 'India', 'weekend',
  '2026-07-24', '2026-07-27', '4 Days / 3 Nights',
  JSON_ARRAY('4D/3N','3D/2N'),
  6999, 8999, 16, 24,
  'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1540206395-68808572332f?w=600&q=80',
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80'
  ),
  '☕', 'Monsoon Special', '#2DBFBB', 'Easy',
  JSON_ARRAY('Coffee plantation walk & tasting','Abbey Falls in full monsoon flow','Raja\'s Seat sunset viewpoint','Dubare elephant camp morning','Barapole river rafting','Authentic Kodava home-cooked meals'),
  JSON_ARRAY('Day 1: Bangalore → Coorg by AC cab (4.5 hrs)','Day 2: Plantation tour, Abbey Falls, Omkareshwar Temple','Day 3: Dubare elephant camp, river rafting, Raja\'s Seat sunset','Day 4: Local Madikeri market, depart to Bangalore'),
  JSON_ARRAY('AC cab Bangalore–Coorg–Bangalore','Coffee plantation homestay (twin sharing, 3 nights)','All meals (breakfast & dinner)','Coffee estate guided walk & tasting','Dubare elephant camp entry','Barapole rafting (Grade I–II)'),
  JSON_ARRAY('Lunch','Personal expenses','Zip-line (optional)'),
  4.6, 203, 0
),

-- 10. Ladakh Bike Expedition (himalayan)
(
  'ladakh-bike-expedition',
  'Ladakh Bike Expedition',
  'The ultimate ride — Manali to Leh on Royal Enfield across high passes',
  'Leh-Ladakh', 'India', 'himalayan',
  '2026-08-22', '2026-09-01', '11 Days / 10 Nights',
  JSON_ARRAY('11D/10N'),
  22999, 29999, 8, 14,
  'https://images.unsplash.com/photo-1571995170435-c77d41a5d174?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=600&q=80',
    'https://images.unsplash.com/photo-1602350358430-fa8a6a53acbc?w=600&q=80'
  ),
  '🏍️', 'Bucket List', '#8B5CF6', 'Challenging',
  JSON_ARRAY('Khardung La — one of world\'s highest motorable passes','Pangong Lake mesmerizing blue waters','Nubra Valley sand dunes & Bactrian camels','Magnetic Hill & Gurudwara Pathar Sahib','Rohtang Pass & Baralacha La','Leh Palace & ancient monasteries'),
  JSON_ARRAY('Day 1: Fly Delhi → Manali, acclimatisation day','Day 2: Manali → Jispa via Rohtang Pass (snow!)','Day 3: Jispa → Sarchu (Baralacha La, Nakeela, Lachungla)','Day 4: Sarchu → Leh via Tanglangla (17,480 ft!)','Day 5: Leh city — Palace, Shanti Stupa, acclimatise','Day 6: Khardung La → Nubra Valley (sand dunes, camels)','Day 7: Nubra → Pangong Lake (stunning blue!)','Day 8: Pangong → Leh via Changla Pass','Day 9: Magnetic Hill, Gurudwara, Sangam confluence','Day 10: Spituk monastery, free evening, farewell dinner','Day 11: Fly Leh → Delhi'),
  JSON_ARRAY('Royal Enfield 350 per 2 riders (solo option available)','All accommodation — hotels & camps (10 nights)','Breakfast & dinner daily','Experienced biker guide (leads & sweeps)','Mechanic support vehicle throughout','Inner Line Permits (Nubra, Pangong)','Bike fuel included to Leh','Return flight Leh → Delhi'),
  JSON_ARRAY('Delhi → Manali travel','Helmet & riding gear (rent ₹1,500)','Lunch on road','Travel insurance (mandatory for this trip)','Personal expenses'),
  4.9, 67, 1
);

-- ── Batches for each trip ──────────────────────────────────────────────────

-- Trip 1: Kasol Kheerganga Trek
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='kasol-kheerganga-trek'), 'KKT-JUL04', '2026-07-04', 18, 'Available'),
((SELECT id FROM trips WHERE slug='kasol-kheerganga-trek'), 'KKT-JUL18', '2026-07-18', 8,  'Filling Fast'),
((SELECT id FROM trips WHERE slug='kasol-kheerganga-trek'), 'KKT-AUG01', '2026-08-01', 25, 'Available'),
((SELECT id FROM trips WHERE slug='kasol-kheerganga-trek'), 'KKT-AUG15', '2026-08-15', 3,  'Last Few Seats');

-- Trip 2: Manali Weekend Escape
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='manali-weekend-escape'), 'MWE-JUL10', '2026-07-10', 14, 'Available'),
((SELECT id FROM trips WHERE slug='manali-weekend-escape'), 'MWE-JUL24', '2026-07-24', 6,  'Filling Fast'),
((SELECT id FROM trips WHERE slug='manali-weekend-escape'), 'MWE-AUG07', '2026-08-07', 20, 'Available');

-- Trip 3: Kedarkantha Summit Trek
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='kedarkantha-summit-trek'), 'KST-AUG01', '2026-08-01', 16, 'Available'),
((SELECT id FROM trips WHERE slug='kedarkantha-summit-trek'), 'KST-AUG15', '2026-08-15', 4,  'Last Few Seats'),
((SELECT id FROM trips WHERE slug='kedarkantha-summit-trek'), 'KST-SEP05', '2026-09-05', 22, 'Available');

-- Trip 4: Rishikesh Adventure Weekend
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='rishikesh-adventure-weekend'), 'RAW-JUL17', '2026-07-17', 22, 'Available'),
((SELECT id FROM trips WHERE slug='rishikesh-adventure-weekend'), 'RAW-JUL31', '2026-07-31', 12, 'Filling Fast'),
((SELECT id FROM trips WHERE slug='rishikesh-adventure-weekend'), 'RAW-AUG14', '2026-08-14', 30, 'Available'),
((SELECT id FROM trips WHERE slug='rishikesh-adventure-weekend'), 'RAW-AUG28', '2026-08-28', 2,  'Last Few Seats');

-- Trip 5: Bali Tropical Escape
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='bali-tropical-escape'), 'BTE-AUG15', '2026-08-15', 12, 'Available'),
((SELECT id FROM trips WHERE slug='bali-tropical-escape'), 'BTE-SEP12', '2026-09-12', 18, 'Available'),
((SELECT id FROM trips WHERE slug='bali-tropical-escape'), 'BTE-OCT10', '2026-10-10', 5,  'Filling Fast');

-- Trip 6: Spiti Valley Road Trip
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='spiti-valley-road-trip'), 'SVR-SEP05', '2026-09-05', 10, 'Available'),
((SELECT id FROM trips WHERE slug='spiti-valley-road-trip'), 'SVR-SEP19', '2026-09-19', 2,  'Last Few Seats'),
((SELECT id FROM trips WHERE slug='spiti-valley-road-trip'), 'SVR-OCT03', '2026-10-03', 16, 'Available');

-- Trip 7: Hampi Backpacker Trail
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='hampi-backpacker-trail'), 'HBT-AUG08', '2026-08-08', 20, 'Available'),
((SELECT id FROM trips WHERE slug='hampi-backpacker-trail'), 'HBT-AUG22', '2026-08-22', 28, 'Available'),
((SELECT id FROM trips WHERE slug='hampi-backpacker-trail'), 'HBT-SEP05', '2026-09-05', 9,  'Filling Fast');

-- Trip 8: Thailand Group Tour
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='thailand-group-tour'), 'TGT-SEP18', '2026-09-18', 8,  'Filling Fast'),
((SELECT id FROM trips WHERE slug='thailand-group-tour'), 'TGT-OCT16', '2026-10-16', 16, 'Available'),
((SELECT id FROM trips WHERE slug='thailand-group-tour'), 'TGT-NOV13', '2026-11-13', 16, 'Available');

-- Trip 9: Coorg Coffee Trail
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='coorg-coffee-trail'), 'CCT-JUL24', '2026-07-24', 16, 'Available'),
((SELECT id FROM trips WHERE slug='coorg-coffee-trail'), 'CCT-AUG07', '2026-08-07', 24, 'Available'),
((SELECT id FROM trips WHERE slug='coorg-coffee-trail'), 'CCT-AUG21', '2026-08-21', 5,  'Filling Fast');

-- Trip 10: Ladakh Bike Expedition
INSERT INTO batches (trip_id, batch_code, departure_date, seats_left, status) VALUES
((SELECT id FROM trips WHERE slug='ladakh-bike-expedition'), 'LBE-AUG22', '2026-08-22', 8,  'Available'),
((SELECT id FROM trips WHERE slug='ladakh-bike-expedition'), 'LBE-SEP19', '2026-09-19', 14, 'Available'),
((SELECT id FROM trips WHERE slug='ladakh-bike-expedition'), 'LBE-OCT10', '2026-10-10', 3,  'Last Few Seats');

SELECT CONCAT('✅ Inserted ', COUNT(*), ' trips') AS result FROM trips;
SELECT CONCAT('✅ Inserted ', COUNT(*), ' batches') AS result FROM batches;
