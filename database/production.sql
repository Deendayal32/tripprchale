-- ═══════════════════════════════════════════════════════════════
--  TripprChale — Production Database Setup
--  Safe to run on BOTH fresh installs and existing databases.
--  Run via:  node migrate.js
--  Or via phpMyAdmin / MySQL Workbench / SSH mysql client
-- ═══════════════════════════════════════════════════════════════

SET NAMES utf8mb4 COLLATE utf8mb4_general_ci;
SET FOREIGN_KEY_CHECKS = 0;

-- ── 1. Tables ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS trips (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  slug          VARCHAR(255) NOT NULL DEFAULT '' UNIQUE,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS batches (
  id             INT         PRIMARY KEY AUTO_INCREMENT,
  trip_id        INT         NOT NULL,
  batch_code     VARCHAR(50) DEFAULT NULL,
  departure_date DATE        NOT NULL,
  seats_left     INT         NOT NULL DEFAULT 10,
  status         ENUM('Available','Filling Fast','Last Few Seats') DEFAULT 'Available',
  created_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS categories (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  slug       VARCHAR(60)  NOT NULL UNIQUE,
  label      VARCHAR(100) NOT NULL,
  emoji      VARCHAR(10)  DEFAULT '🌍',
  sort_order INT          DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS contacts (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(20)  DEFAULT NULL,
  message    TEXT         DEFAULT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ── 2. Migrations (safe on existing DB) ─────────────────────

-- Fix collation mismatch: pin every table to utf8mb4_general_ci
ALTER TABLE trips     CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
ALTER TABLE batches   CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
ALTER TABLE contacts  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
ALTER TABLE bookings  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE trips
  MODIFY COLUMN slug    VARCHAR(255) NOT NULL DEFAULT '',
  MODIFY COLUMN tagline VARCHAR(255) NOT NULL DEFAULT '';

-- Add unique index on slug only if it doesn't already exist
SET @idx := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'trips'
    AND INDEX_NAME   = 'slug'
);
SET @sql := IF(@idx = 0,
  'ALTER TABLE trips ADD UNIQUE INDEX slug (slug)',
  'SELECT "slug index already exists"'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Back-fill slugs for rows that have none
UPDATE trips
SET slug = CONCAT(
  LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-')),
  '-', id
)
WHERE slug = '' OR slug IS NULL;

-- ── 3. Seed categories (idempotent) ─────────────────────────

INSERT IGNORE INTO categories (slug, label, emoji, sort_order) VALUES
  ('weekend',       'Weekend Getaways', '🏖️', 1),
  ('backpacking',   'Backpacking',      '🎒', 2),
  ('himalayan',     'Himalayan',        '🏔️', 3),
  ('international', 'International',    '✈️', 4);

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Database setup complete.' AS status;
