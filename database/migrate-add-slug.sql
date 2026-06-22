-- Run this ONCE on your existing live database.
-- mysql -u root -p tripprchalo < database/migrate-add-slug.sql

USE tripprchalo;

-- Add slug column if it doesn't already exist
ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS slug VARCHAR(255) NOT NULL DEFAULT '' AFTER id;

-- Add tagline column if it doesn't already exist
ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS tagline VARCHAR(255) NOT NULL DEFAULT '' AFTER duration;

-- Back-fill slugs for any existing rows that have none
UPDATE trips
SET slug = CONCAT(
  LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-')),
  '-',
  id
)
WHERE slug = '' OR slug IS NULL;

-- Enforce uniqueness on slug
ALTER TABLE trips
  MODIFY COLUMN slug VARCHAR(255) NOT NULL,
  ADD UNIQUE INDEX IF NOT EXISTS idx_trips_slug (slug);
