-- ═══════════════════════════════════════════════════════════
--  TripprChale Database Schema + Seed Data
--  Run: node scripts/setup-db.mjs
-- ═══════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS tripprchalo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tripprchalo;

-- ── Trips ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(255) NOT NULL,
  destination   VARCHAR(255) NOT NULL,
  category      ENUM('weekend','backpacking','himalayan','international') NOT NULL DEFAULT 'weekend',
  price         INT          NOT NULL,
  originalPrice INT          DEFAULT NULL,
  totalSeats    INT          NOT NULL DEFAULT 20,
  seatsLeft     INT          NOT NULL DEFAULT 20,
  image         VARCHAR(600) DEFAULT NULL,
  emoji         VARCHAR(10)  DEFAULT '✈️',
  badge         VARCHAR(60)  DEFAULT NULL,
  badgeColor    VARCHAR(20)  DEFAULT '#FF914D',
  difficulty    ENUM('Easy','Moderate','Challenging') DEFAULT 'Easy',
  duration      VARCHAR(100) DEFAULT NULL,
  tagline       VARCHAR(255) NOT NULL DEFAULT '',
  highlights    JSON         DEFAULT NULL,
  includes      JSON         DEFAULT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Batches ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS batches (
  id             INT         PRIMARY KEY AUTO_INCREMENT,
  trip_id        INT         NOT NULL,
  batch_code     VARCHAR(50) DEFAULT NULL,
  departure_date DATE        NOT NULL,
  seats_left     INT         NOT NULL DEFAULT 10,
  status         ENUM('Available','Filling Fast','Last Few Seats') DEFAULT 'Available',
  created_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Categories ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  slug       VARCHAR(60)  NOT NULL UNIQUE,
  label      VARCHAR(100) NOT NULL,
  emoji      VARCHAR(10)  DEFAULT '🌍',
  sort_order INT          DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Contacts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(20)  DEFAULT NULL,
  message    TEXT         DEFAULT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Bookings (for future use) ────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  trip_id     INT          NOT NULL,
  batch_id    INT          NOT NULL,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  amount_paid INT          NOT NULL DEFAULT 0,
  status      ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id)  REFERENCES trips(id),
  FOREIGN KEY (batch_id) REFERENCES batches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ════════════════════════════════════════════════════════════
--  SEED DATA – 10 Trips
-- ════════════════════════════════════════════════════════════

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE batches;
TRUNCATE TABLE trips;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO trips (id,slug,name,destination,category,price,originalPrice,totalSeats,seatsLeft,image,emoji,badge,badgeColor,difficulty,duration,highlights,includes) VALUES

(1,'kasol-manali-adventure','Kasol Manali Adventure','Kasol & Manali','himalayan',9999,NULL,25,12,
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
'⛰️','HIMALAYAN','#1B2A4A','Moderate','5 Days / 4 Nights',
'["Kheerganga Trek","Manali Mall Road","Rohtang Pass","Kullu River Rafting"]',
'["Hotel / Homestay","Transport","Trip captain","Breakfast"]'),

(2,'rajasthan-royal-escapade','Rajasthan Royal Escapade','Jaisalmer & Jodhpur','backpacking',9999,13999,30,15,
'https://images.unsplash.com/photo-1477587458883-47145ed68b1e?w=700&q=80',
'🏜️','HOT DEAL','#FF914D','Easy','5 Days / 4 Nights',
'["Desert Safari","Jaisalmer Fort","Camel Ride","Blue City Jodhpur"]',
'["Hotel stays","Transport","Trip captain","Breakfast"]'),

(3,'goa-beach-backpacking','Goa Beach Backpacking','Goa','backpacking',9999,12999,30,18,
'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=80',
'🌊','BEACH VIBES','#00C2FF','Easy','5 Days / 4 Nights',
'["Baga Beach Party","Old Goa Churches","Dudhsagar Falls","Flea Markets"]',
'["Hostel / Hotel","Transport","Trip captain"]'),

(4,'coorg-coffee-trail','Coorg Coffee Trail','Coorg','weekend',6499,NULL,20,8,
'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=700&q=80',
'☕','WEEKEND','#795548','Easy','3 Days / 2 Nights',
'["Coffee Plantation Walk","Abbey Falls","Rajas Seat","Tibetan Monastery"]',
'["Homestay","Transport","Trip captain","Meals"]'),

(5,'rishikesh-river-rush','Rishikesh River Rush','Rishikesh','weekend',5499,NULL,20,3,
'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=700&q=80',
'🚣','ADVENTURE','#FF914D','Moderate','3 Days / 2 Nights',
'["White Water Rafting","Bungee Jumping","Beatles Ashram","Camping by Ganga"]',
'["Camp stay","Transport","Trip captain","Meals"]'),

(6,'spiti-valley-expedition','Spiti Valley Expedition','Spiti Valley','himalayan',18999,NULL,18,9,
'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=700&q=80',
'🏔️','OFFBEAT','#795548','Challenging','8 Days / 7 Nights',
'["Key Monastery","Chandratal Lake","Pin Valley","Kaza Market"]',
'["Hotel / Homestay","Transport","Trip captain","All meals"]'),

(7,'ladakh-high-altitude-trek','Ladakh High Altitude Trek','Ladakh','himalayan',25999,30999,20,4,
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
'🧊','EXPEDITION','#1B2A4A','Challenging','8 Days / 7 Nights',
'["Pangong Lake","Nubra Valley","Khardung La Pass","Magnetic Hill"]',
'["Hotel stays","Transport","Trip captain","Breakfast"]'),

(8,'thailand-beach-escape','Thailand Beach Escape','Thailand','international',24999,30999,25,8,
'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=700&q=80',
'🏖️','INTERNATIONAL','#7C5CBF','Easy','8 Days / 7 Nights',
'["Phi Phi Islands","Bangkok Street Food","Tiger Temple","Floating Market"]',
'["Hotel stays","Flights","Transport","Trip captain","Breakfast"]'),

(9,'bali-spiritual-retreat','Bali Spiritual Retreat','Bali','international',32999,NULL,20,6,
'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80',
'🌺','PARADISE','#E91E8C','Easy','8 Days / 7 Nights',
'["Ubud Rice Terraces","Tanah Lot Temple","Uluwatu Sunset","Seminyak Beach"]',
'["Villa stays","Flights","Transport","Trip captain"]'),

(10,'vietnam-cultural-journey','Vietnam Cultural Journey','Vietnam','international',27999,NULL,25,14,
'https://images.unsplash.com/photo-1552832046-3d46fd96f1f7?w=700&q=80',
'🌿','NEW','#4CAF50','Easy','8 Days / 7 Nights',
'["Ha Long Bay","Hoi An Lanterns","Ho Chi Minh City","Mekong Delta"]',
'["Hotel stays","Flights","Transport","Trip captain","Breakfast"]');

-- ── Batches seed ─────────────────────────────────────────────
INSERT INTO batches (trip_id,batch_code,departure_date,seats_left,status) VALUES
(1,'B-JUN-19','2026-06-19',12,'Filling Fast'),
(1,'B-JUN-26','2026-06-26',8,'Last Few Seats'),
(1,'B-JUL-03','2026-07-03',20,'Available'),
(2,'B-JUN-20','2026-06-20',15,'Available'),
(2,'B-JUN-27','2026-06-27',10,'Filling Fast'),
(2,'B-JUL-04','2026-07-04',25,'Available'),
(3,'B-JUN-24','2026-06-24',18,'Available'),
(3,'B-JUN-30','2026-06-30',12,'Filling Fast'),
(3,'B-JUL-07','2026-07-07',28,'Available'),
(4,'B-JUN-21','2026-06-21',8,'Filling Fast'),
(4,'B-JUN-28','2026-06-28',15,'Available'),
(4,'B-JUL-05','2026-07-05',20,'Available'),
(5,'B-JUN-28','2026-06-28',3,'Last Few Seats'),
(5,'B-JUL-05','2026-07-05',12,'Available'),
(5,'B-JUL-12','2026-07-12',18,'Available'),
(6,'B-JUL-05','2026-07-05',9,'Filling Fast'),
(6,'B-JUL-19','2026-07-19',14,'Available'),
(6,'B-AUG-02','2026-08-02',18,'Available'),
(7,'B-JUL-18','2026-07-18',4,'Last Few Seats'),
(7,'B-AUG-01','2026-08-01',11,'Available'),
(7,'B-AUG-15','2026-08-15',20,'Available'),
(8,'B-JUL-10','2026-07-10',8,'Filling Fast'),
(8,'B-AUG-07','2026-08-07',18,'Available'),
(8,'B-SEP-04','2026-09-04',25,'Available'),
(9,'B-AUG-05','2026-08-05',6,'Last Few Seats'),
(9,'B-SEP-03','2026-09-03',14,'Available'),
(10,'B-SEP-10','2026-09-10',14,'Available'),
(10,'B-OCT-08','2026-10-08',25,'Available');

-- ── Categories seed ──────────────────────────────────────────
INSERT IGNORE INTO categories (slug,label,emoji,sort_order) VALUES
('weekend',       'Weekend Getaways', '🏖️', 1),
('backpacking',   'Backpacking',      '🎒', 2),
('himalayan',     'Himalayan',        '🏔️', 3),
('international', 'International',    '✈️', 4);
