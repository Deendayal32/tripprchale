-- ═══════════════════════════════════════════════════════════════
--  TripprChale — Migration: Add trip gallery images column
--  Run once via phpMyAdmin on Hostinger.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE `trips`
  ADD COLUMN IF NOT EXISTS `images` JSON DEFAULT NULL AFTER `image`;

SELECT 'Migration complete — images column added to trips table.' AS status;
