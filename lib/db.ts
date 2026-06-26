import mysql from 'mysql2/promise'

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined
}

function makePool(): mysql.Pool {
  const pool = mysql.createPool({
    host:     process.env.DB_HOST     ?? 'localhost',
    port:     Number(process.env.DB_PORT ?? 3306),
    user:     process.env.DB_USER     ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME     ?? 'tripprchalo',
    charset:  'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

  // Force utf8mb4_unicode_ci on every physical connection.
  // This overrides any server-level default and prevents the
  // "Illegal mix of collations" error on Hostinger MySQL.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const underlying = (pool as any).pool
  if (underlying?.on) {
    underlying.on('connection', (conn: { query: (sql: string) => void }) => {
      conn.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci')
    })
  }

  return pool
}

const pool = global._mysqlPool ?? makePool()

if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = pool
}

export default pool
