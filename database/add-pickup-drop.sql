-- Migration: add pickup_drop column to trips table
-- Run this once on your MySQL database before deploying

ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS pickup_drop VARCHAR(150) NOT NULL DEFAULT 'Delhi to Delhi';
