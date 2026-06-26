-- Fix contacts table: add missing columns
-- Run this in phpMyAdmin if your contacts table already exists

ALTER TABLE contacts
  MODIFY COLUMN email VARCHAR(255) NOT NULL DEFAULT '',
  MODIFY COLUMN phone VARCHAR(20)  NOT NULL DEFAULT '';

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS travellers  VARCHAR(20)  DEFAULT '1'  AFTER phone,
  ADD COLUMN IF NOT EXISTS destination VARCHAR(255) DEFAULT ''   AFTER travellers,
  ADD COLUMN IF NOT EXISTS date        VARCHAR(100) DEFAULT ''   AFTER destination;

ALTER TABLE contacts
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
