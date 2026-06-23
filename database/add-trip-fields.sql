-- ═══════════════════════════════════════════════════════════════
--  TripprChale — Migration: Add Enhanced Trip Fields
--  Run once via phpMyAdmin on Hostinger.
--  Safe to run multiple times — uses IF NOT EXISTS.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE `trips`
  ADD COLUMN IF NOT EXISTS `exclusions`          JSON    DEFAULT NULL          AFTER `includes`,
  ADD COLUMN IF NOT EXISTS `quad_price`          INT     DEFAULT NULL          AFTER `exclusions`,
  ADD COLUMN IF NOT EXISTS `triple_price`        INT     DEFAULT NULL          AFTER `quad_price`,
  ADD COLUMN IF NOT EXISTS `double_price`        INT     DEFAULT NULL          AFTER `triple_price`,
  ADD COLUMN IF NOT EXISTS `advance_amount`      INT     NOT NULL DEFAULT 2000 AFTER `double_price`,
  ADD COLUMN IF NOT EXISTS `itinerary`           JSON    DEFAULT NULL          AFTER `advance_amount`,
  ADD COLUMN IF NOT EXISTS `cancellation_policy` TEXT    DEFAULT NULL          AFTER `itinerary`,
  ADD COLUMN IF NOT EXISTS `trip_terms`          TEXT    DEFAULT NULL          AFTER `cancellation_policy`;

SELECT 'Migration complete — new columns added to trips table.' AS status;
