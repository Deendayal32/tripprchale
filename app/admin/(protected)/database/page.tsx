'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Play, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2, Terminal } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   Pre-defined migrations required by this app
───────────────────────────────────────────────────────────── */
const MIGRATIONS = [
  {
    id: 'create-tables',
    title: 'Create All Base Tables',
    description: 'Creates trips, categories, batches, contacts and bookings tables with all current columns. Safe to re-run (uses IF NOT EXISTS).',
    sql: `CREATE TABLE IF NOT EXISTS \`trips\` (
  \`id\`                   INT           NOT NULL AUTO_INCREMENT,
  \`slug\`                 VARCHAR(255)  NOT NULL DEFAULT '' UNIQUE,
  \`name\`                 VARCHAR(255)  NOT NULL,
  \`destination\`          VARCHAR(255)  NOT NULL,
  \`category\`             ENUM('weekend','backpacking','himalayan','international') NOT NULL DEFAULT 'weekend',
  \`price\`                INT           NOT NULL,
  \`originalPrice\`        INT           DEFAULT NULL,
  \`totalSeats\`           INT           NOT NULL DEFAULT 20,
  \`seatsLeft\`            INT           NOT NULL DEFAULT 20,
  \`image\`                VARCHAR(600)  DEFAULT NULL,
  \`emoji\`                VARCHAR(10)   DEFAULT '✈️',
  \`badge\`                VARCHAR(60)   DEFAULT NULL,
  \`badgeColor\`           VARCHAR(20)   DEFAULT '#FF914D',
  \`difficulty\`           ENUM('Easy','Moderate','Challenging') DEFAULT 'Easy',
  \`duration\`             VARCHAR(100)  DEFAULT NULL,
  \`tagline\`              VARCHAR(255)  NOT NULL DEFAULT '',
  \`highlights\`           JSON          DEFAULT NULL,
  \`includes\`             JSON          DEFAULT NULL,
  \`exclusions\`           JSON          DEFAULT NULL,
  \`quad_price\`           INT           DEFAULT NULL,
  \`triple_price\`         INT           DEFAULT NULL,
  \`double_price\`         INT           DEFAULT NULL,
  \`advance_amount\`       INT           NOT NULL DEFAULT 2000,
  \`itinerary\`            JSON          DEFAULT NULL,
  \`cancellation_policy\`  TEXT          DEFAULT NULL,
  \`trip_terms\`           TEXT          DEFAULT NULL,
  \`created_at\`           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\`           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_trips_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\`         INT          NOT NULL AUTO_INCREMENT,
  \`slug\`       VARCHAR(60)  NOT NULL UNIQUE,
  \`label\`      VARCHAR(100) NOT NULL,
  \`emoji\`      VARCHAR(10)  DEFAULT '🌍',
  \`sort_order\` INT          DEFAULT 0,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`batches\` (
  \`id\`             INT         NOT NULL AUTO_INCREMENT,
  \`trip_id\`        INT         NOT NULL,
  \`batch_code\`     VARCHAR(50) DEFAULT NULL,
  \`departure_date\` DATE        NOT NULL,
  \`seats_left\`     INT         NOT NULL DEFAULT 10,
  \`status\`         ENUM('Available','Filling Fast','Last Few Seats') DEFAULT 'Available',
  \`created_at\`     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  CONSTRAINT \`fk_batches_trip\` FOREIGN KEY (\`trip_id\`) REFERENCES \`trips\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`contacts\` (
  \`id\`         INT          NOT NULL AUTO_INCREMENT,
  \`name\`       VARCHAR(255) NOT NULL,
  \`email\`      VARCHAR(255) NOT NULL,
  \`phone\`      VARCHAR(20)  DEFAULT NULL,
  \`message\`    TEXT         DEFAULT NULL,
  \`created_at\` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`bookings\` (
  \`id\`          INT          NOT NULL AUTO_INCREMENT,
  \`trip_id\`     INT          NOT NULL,
  \`batch_id\`    INT          NOT NULL,
  \`name\`        VARCHAR(255) NOT NULL,
  \`email\`       VARCHAR(255) NOT NULL,
  \`phone\`       VARCHAR(20)  NOT NULL,
  \`amount_paid\` INT          NOT NULL DEFAULT 0,
  \`status\`      ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  \`created_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  CONSTRAINT \`fk_bookings_trip\`  FOREIGN KEY (\`trip_id\`)  REFERENCES \`trips\`   (\`id\`),
  CONSTRAINT \`fk_bookings_batch\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batches\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    id: 'add-slug-tagline',
    title: 'Add slug & tagline columns',
    description: 'Adds slug and tagline to the trips table if missing. Back-fills slugs for existing rows.',
    sql: `ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS slug    VARCHAR(255) NOT NULL DEFAULT '' AFTER id,
  ADD COLUMN IF NOT EXISTS tagline VARCHAR(255) NOT NULL DEFAULT '' AFTER duration;

UPDATE trips
SET slug = CONCAT(LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-')), '-', id)
WHERE slug = '' OR slug IS NULL`,
  },
  {
    id: 'add-enhanced-fields',
    title: 'Add Enhanced Trip Fields',
    description: 'Adds exclusions, sharing prices (quad/triple/double), advance amount, itinerary, cancellation policy and trip terms columns.',
    sql: `ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS exclusions          JSON    DEFAULT NULL          AFTER includes,
  ADD COLUMN IF NOT EXISTS quad_price          INT     DEFAULT NULL          AFTER exclusions,
  ADD COLUMN IF NOT EXISTS triple_price        INT     DEFAULT NULL          AFTER quad_price,
  ADD COLUMN IF NOT EXISTS double_price        INT     DEFAULT NULL          AFTER triple_price,
  ADD COLUMN IF NOT EXISTS advance_amount      INT     NOT NULL DEFAULT 2000 AFTER double_price,
  ADD COLUMN IF NOT EXISTS itinerary           JSON    DEFAULT NULL          AFTER advance_amount,
  ADD COLUMN IF NOT EXISTS cancellation_policy TEXT    DEFAULT NULL          AFTER itinerary,
  ADD COLUMN IF NOT EXISTS trip_terms          TEXT    DEFAULT NULL          AFTER cancellation_policy`,
  },
  {
    id: 'fix-collation',
    title: 'Fix Collation (utf8mb4_unicode_ci)',
    description: 'Converts all tables to utf8mb4_unicode_ci to match Hostinger\'s server default and prevent collation mismatch errors.',
    sql: `ALTER TABLE trips      CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE batches    CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE contacts   CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE bookings   CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    id: 'seed-categories',
    title: 'Seed Default Categories',
    description: 'Inserts the 4 default trip categories. Safe to re-run (uses INSERT IGNORE).',
    sql: `INSERT IGNORE INTO categories (slug, label, emoji, sort_order) VALUES
('weekend',       'Weekend Getaways', '🏖️', 1),
('backpacking',   'Backpacking',      '🎒', 2),
('himalayan',     'Himalayan',        '🏔️', 3),
('international', 'International',    '✈️', 4)`,
  },
]

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type RunStatus = 'idle' | 'running' | 'success' | 'error'
type StmtResult = { statement: string; success: boolean; affectedRows?: number; error?: string; rows?: unknown[] }

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function DatabasePage() {
  const [migStatuses,  setMigStatuses]  = useState<Record<string, RunStatus>>({})
  const [migResults,   setMigResults]   = useState<Record<string, StmtResult[]>>({})
  const [migExpanded,  setMigExpanded]  = useState<Record<string, boolean>>({})
  const [sqlExpanded,  setSqlExpanded]  = useState<Record<string, boolean>>({})

  const [customSql,    setCustomSql]    = useState('')
  const [customStatus, setCustomStatus] = useState<RunStatus>('idle')
  const [customResults,setCustomResults]= useState<StmtResult[]>([])

  async function runMigration(id: string, sql: string) {
    setMigStatuses(s => ({ ...s, [id]: 'running' }))
    setMigResults(s => ({ ...s, [id]: [] }))
    setMigExpanded(s => ({ ...s, [id]: true }))
    try {
      const res  = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      })
      const data = await res.json()
      setMigResults(s => ({ ...s, [id]: data.results ?? [] }))
      setMigStatuses(s => ({ ...s, [id]: data.success ? 'success' : 'error' }))
    } catch (err) {
      setMigResults(s => ({ ...s, [id]: [{ statement: sql.slice(0, 80), success: false, error: String(err) }] }))
      setMigStatuses(s => ({ ...s, [id]: 'error' }))
    }
  }

  async function runCustomSql() {
    if (!customSql.trim()) return
    setCustomStatus('running')
    setCustomResults([])
    try {
      const res  = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: customSql }),
      })
      const data = await res.json()
      setCustomResults(data.results ?? [])
      setCustomStatus(data.success ? 'success' : 'error')
    } catch (err) {
      setCustomResults([{ statement: customSql.slice(0, 80), success: false, error: String(err) }])
      setCustomStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="font-bold text-2xl" style={{ color: 'var(--navy)' }}>Database Manager</h1>
          <p className="text-gray-400 text-sm">Run migrations and custom SQL directly from the admin panel</p>
        </div>
      </div>

      {/* Warning */}
      <div className="rounded-2xl p-4 mb-8 flex items-start gap-3 text-sm"
        style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
        <span className="text-xl shrink-0">⚠️</span>
        <div style={{ color: '#92400e' }}>
          <strong>Caution:</strong> These queries run directly on your production database.
          Always back up your data before running structural changes (ALTER TABLE, DROP, etc.).
        </div>
      </div>

      {/* ── Pre-defined Migrations ── */}
      <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--navy)' }}>
        Required Migrations
      </h2>
      <div className="space-y-4 mb-10">
        {MIGRATIONS.map(mig => {
          const status  = migStatuses[mig.id] ?? 'idle'
          const results = migResults[mig.id]  ?? []
          const open    = !!migExpanded[mig.id]
          const sqlOpen = !!sqlExpanded[mig.id]

          return (
            <div key={mig.id} className="rounded-2xl overflow-hidden"
              style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>

              {/* Card header */}
              <div className="flex items-start gap-4 p-5">
                {/* Status icon */}
                <div className="shrink-0 mt-0.5">
                  {status === 'idle'    && <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: '#e5e7eb' }} />}
                  {status === 'running' && <Loader2 size={24} className="animate-spin" style={{ color: 'var(--sky)' }} />}
                  {status === 'success' && <CheckCircle size={24} style={{ color: '#22c55e' }} />}
                  {status === 'error'   && <XCircle    size={24} style={{ color: '#ef4444' }} />}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--navy)' }}>{mig.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{mig.description}</p>

                  {/* SQL preview toggle */}
                  <button
                    onClick={() => setSqlExpanded(s => ({ ...s, [mig.id]: !s[mig.id] }))}
                    className="flex items-center gap-1 text-xs mt-2 transition-colors hover:opacity-70"
                    style={{ color: 'var(--sky)' }}
                  >
                    {sqlOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {sqlOpen ? 'Hide SQL' : 'View SQL'}
                  </button>
                  {sqlOpen && (
                    <pre className="mt-2 p-3 rounded-xl text-xs overflow-x-auto leading-relaxed"
                      style={{ background: '#0f172a', color: '#94a3b8', fontFamily: 'monospace' }}>
                      {mig.sql}
                    </pre>
                  )}
                </div>

                {/* Run button */}
                <button
                  onClick={() => runMigration(mig.id, mig.sql)}
                  disabled={status === 'running'}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{
                    background: status === 'running' ? '#94a3b8' : 'var(--primary)',
                    opacity: status === 'running' ? 0.7 : 1,
                  }}
                >
                  {status === 'running'
                    ? <><Loader2 size={12} className="animate-spin" /> Running…</>
                    : <><Play size={12} /> Run</>}
                </button>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div style={{ borderTop: '1px solid #f0f0f0' }}>
                  <button
                    onClick={() => setMigExpanded(s => ({ ...s, [mig.id]: !s[mig.id] }))}
                    className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors"
                    style={{ color: 'var(--navy)' }}
                  >
                    <span>Results ({results.length} statement{results.length !== 1 ? 's' : ''})</span>
                    {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {open && (
                    <div className="px-5 pb-4 space-y-2">
                      <ResultsList results={results} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Custom SQL Runner ── */}
      <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--navy)' }}>
        Custom SQL Runner
      </h2>
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={16} style={{ color: 'var(--navy)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>Execute SQL</span>
        </div>
        <textarea
          value={customSql}
          onChange={e => setCustomSql(e.target.value)}
          placeholder={`-- Write your SQL here. Multiple statements separated by semicolons are supported.\nSELECT * FROM trips LIMIT 5;\nSELECT COUNT(*) FROM batches;`}
          rows={8}
          className="w-full text-xs px-4 py-3 rounded-xl border outline-none resize-y focus:border-blue-400 transition-colors"
          style={{ borderColor: '#e5e7eb', fontFamily: 'monospace', background: '#0f172a', color: '#94a3b8', lineHeight: 1.6 }}
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">
            Tip: Multiple statements can be separated by <code className="px-1 py-0.5 rounded text-xs" style={{ background: '#f0f0f0' }}>;</code>
          </p>
          <button
            onClick={runCustomSql}
            disabled={customStatus === 'running' || !customSql.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'var(--navy)', opacity: (customStatus === 'running' || !customSql.trim()) ? 0.5 : 1 }}
          >
            {customStatus === 'running'
              ? <><Loader2 size={14} className="animate-spin" /> Running…</>
              : <><Play size={14} /> Run SQL</>}
          </button>
        </div>

        {/* Custom results */}
        {customResults.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--navy)' }}>
              Results ({customResults.length} statement{customResults.length !== 1 ? 's' : ''})
            </p>
            <ResultsList results={customResults} showRows />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   ResultsList sub-component
───────────────────────────────────────────────────────────── */
function ResultsList({ results, showRows = false }: { results: StmtResult[]; showRows?: boolean }) {
  return (
    <div className="space-y-2">
      {results.map((r, i) => (
        <div key={i} className="rounded-xl p-3 text-xs"
          style={{
            background: r.success ? '#f0fdf4' : '#fff1f2',
            border: `1px solid ${r.success ? '#bbf7d0' : '#fecaca'}`,
          }}>
          <div className="flex items-start gap-2">
            {r.success
              ? <CheckCircle size={13} className="shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
              : <XCircle    size={13} className="shrink-0 mt-0.5" style={{ color: '#ef4444' }} />}
            <div className="flex-1 min-w-0">
              <code className="block truncate font-mono" style={{ color: r.success ? '#166534' : '#991b1b' }}>
                {r.statement}
              </code>
              {r.success && r.affectedRows !== undefined && (
                <span className="text-green-600 mt-0.5 block">{r.affectedRows} row{r.affectedRows !== 1 ? 's' : ''} affected</span>
              )}
              {r.error && (
                <span className="text-red-600 mt-0.5 block break-words">{r.error}</span>
              )}
              {showRows && r.rows && r.rows.length > 0 && (
                <div className="mt-2 overflow-x-auto">
                  <pre className="text-xs p-2 rounded" style={{ background: 'rgba(0,0,0,0.04)', color: '#374151' }}>
                    {JSON.stringify(r.rows, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
