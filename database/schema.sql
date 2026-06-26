-- ═══════════════════════════════════════════════════════════
--  TripprChale — Full Database Schema
--  Includes every column used by the application.
-- ═══════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS tripprchalo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tripprchalo;

-- ── Trips ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
  id                   INT           NOT NULL AUTO_INCREMENT,
  slug                 VARCHAR(255)  NOT NULL DEFAULT '',
  name                 VARCHAR(255)  NOT NULL,
  destination          VARCHAR(255)  NOT NULL,
  category             ENUM('weekend','backpacking','himalayan','international') NOT NULL DEFAULT 'weekend',
  price                INT           NOT NULL,
  originalPrice        INT           DEFAULT NULL,
  totalSeats           INT           NOT NULL DEFAULT 20,
  seatsLeft            INT           NOT NULL DEFAULT 20,
  image                VARCHAR(600)  DEFAULT NULL,
  emoji                VARCHAR(10)   DEFAULT '✈️',
  badge                VARCHAR(60)   DEFAULT NULL,
  badgeColor           VARCHAR(20)   DEFAULT '#FF914D',
  difficulty           ENUM('Easy','Moderate','Challenging') DEFAULT 'Easy',
  duration             VARCHAR(100)  DEFAULT NULL,
  tagline              VARCHAR(255)  NOT NULL DEFAULT '',
  highlights           JSON          DEFAULT NULL,
  includes             JSON          DEFAULT NULL,
  excludes             JSON          DEFAULT NULL,
  quad_price           INT           DEFAULT NULL,
  triple_price         INT           DEFAULT NULL,
  double_price         INT           DEFAULT NULL,
  advance_amount       INT           NOT NULL DEFAULT 2000,
  itinerary            JSON          DEFAULT NULL,
  cancellation_policy  TEXT          DEFAULT NULL,
  trip_terms           TEXT          DEFAULT NULL,
  country              VARCHAR(100)  DEFAULT '',
  startDate            DATE          DEFAULT NULL,
  endDate              DATE          DEFAULT NULL,
  created_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_trips_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Batches ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS batches (
  id             INT         NOT NULL AUTO_INCREMENT,
  trip_id        INT         NOT NULL,
  batch_code     VARCHAR(50) DEFAULT NULL,
  departure_date DATE        NOT NULL,
  seats_left     INT         NOT NULL DEFAULT 10,
  status         ENUM('Available','Filling Fast','Last Few Seats') DEFAULT 'Available',
  created_at     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_batches_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Categories ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         INT          NOT NULL AUTO_INCREMENT,
  slug       VARCHAR(60)  NOT NULL,
  label      VARCHAR(100) NOT NULL,
  emoji      VARCHAR(10)  DEFAULT '🌍',
  sort_order INT          DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY idx_cat_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Contacts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL DEFAULT '',
  phone       VARCHAR(20)  NOT NULL DEFAULT '',
  travellers  VARCHAR(20)  DEFAULT '1',
  destination VARCHAR(255) DEFAULT '',
  date        VARCHAR(100) DEFAULT '',
  message     TEXT         DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Bookings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id          INT          NOT NULL AUTO_INCREMENT,
  trip_id     INT          NOT NULL,
  batch_id    INT          NOT NULL,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  amount_paid INT          NOT NULL DEFAULT 0,
  status      ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_bookings_trip  FOREIGN KEY (trip_id)  REFERENCES trips(id),
  CONSTRAINT fk_bookings_batch FOREIGN KEY (batch_id) REFERENCES batches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
