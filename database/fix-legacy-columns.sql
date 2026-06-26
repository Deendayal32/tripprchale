-- Fix legacy columns that block trip creation.
-- Run once in phpMyAdmin on your Hostinger database.
-- Safe to run even if columns don't exist (IF EXISTS guards).

-- Make legacy date columns nullable so they never block an INSERT
ALTER TABLE trips
  MODIFY COLUMN IF EXISTS country    VARCHAR(100) DEFAULT '',
  MODIFY COLUMN IF EXISTS startDate  DATE         DEFAULT NULL,
  MODIFY COLUMN IF EXISTS endDate    DATE         DEFAULT NULL;

-- Add any new columns this app version needs (safe, skips if already present)
ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS excludes          JSON         DEFAULT NULL AFTER includes,
  ADD COLUMN IF NOT EXISTS quad_price          INT          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS triple_price        INT          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS double_price        INT          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS advance_amount      INT          DEFAULT 2000,
  ADD COLUMN IF NOT EXISTS itinerary           JSON         DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS cancellation_policy TEXT         DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS trip_terms          TEXT         DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS slug                VARCHAR(255) DEFAULT '',
  ADD COLUMN IF NOT EXISTS tagline             VARCHAR(255) DEFAULT '';

-- Fix contacts table (adds missing columns if not present)
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS travellers  VARCHAR(20)  DEFAULT '1'  AFTER phone,
  ADD COLUMN IF NOT EXISTS destination VARCHAR(255) DEFAULT ''   AFTER travellers,
  ADD COLUMN IF NOT EXISTS date        VARCHAR(100) DEFAULT ''   AFTER destination;

-- Fix collation on all tables
ALTER TABLE trips    CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE batches  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE contacts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
