#!/usr/bin/env node
// Run DB migrations on the server:  node migrate.js
// Must be run from /var/www/tripprchalo  (where .env.local lives)

const fs   = require('fs')
const path = require('path')

// Load .env.local manually (no dotenv dependency needed)
const envPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('ERROR: .env.local not found. Copy .env.local.example → .env.local first.')
  process.exit(1)
}
fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .filter(l => l && !l.startsWith('#'))
  .forEach(l => {
    const [k, ...v] = l.split('=')
    if (k) process.env[k.trim()] = v.join('=').trim()
  })

const mysql = require('mysql2/promise')

async function main() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT || 3306),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    multipleStatements: true,
  })

  console.log(`Connected to MySQL: ${process.env.DB_USER}@${process.env.DB_HOST}/${process.env.DB_NAME}`)

  const sqlFile = path.join(__dirname, '..', 'database', 'production.sql')
  const sql = fs.readFileSync(sqlFile, 'utf8')

  console.log('Running production.sql ...')
  const results = await conn.query(sql)

  // Last result should be the SELECT 'Database setup complete.' row
  const last = Array.isArray(results[0]) ? results[0] : []
  if (last.length && last[0].status) {
    console.log('✅', last[0].status)
  } else {
    console.log('✅ Migration finished.')
  }

  await conn.end()
}

main().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
