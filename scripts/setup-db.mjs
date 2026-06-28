/**
 * TripprChale – Database Setup Script
 * Run: node scripts/setup-db.mjs
 */
import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = {
  host:     process.env.DB_HOST     ?? '127.0.0.1',
  port:     Number(process.env.DB_PORT ?? 3306),
  user:     process.env.DB_USER     ?? 'u478907498_root',
  password: process.env.DB_PASSWORD ?? 'Asdf@6934',
  multipleStatements: true,
}

const sql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8')

console.log('🔗 Connecting to MySQL…')
const conn = await mysql.createConnection(config)

console.log('📦 Running schema.sql…')
await conn.query(sql)

console.log('✅ Database & tables created, seed data loaded!')
await conn.end()
