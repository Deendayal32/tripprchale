#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# TripprChale — package-source.sh
# Creates a lightweight source-only zip for Hostinger upload.
# NO .next/ build output, NO node_modules.
# Server installs dependencies and builds on first deploy.
# ─────────────────────────────────────────────────────────────
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/deploy"
STAGE="$OUT/_src_stage"
ZIPNAME="tripprchalo-hostinger-source.zip"

echo "📦 Creating source-only zip for Hostinger..."

rm -rf "$STAGE"
mkdir -p "$STAGE"

# ── Source code ──
cp -r "$ROOT/app"        "$STAGE/app"
cp -r "$ROOT/components" "$STAGE/components"
cp -r "$ROOT/lib"        "$STAGE/lib"

# ── Config files ──
cp "$ROOT/next.config.ts"     "$STAGE/"
cp "$ROOT/tsconfig.json"      "$STAGE/"
cp "$ROOT/postcss.config.mjs" "$STAGE/"
cp "$ROOT/eslint.config.mjs"  "$STAGE/"
cp "$ROOT/next-env.d.ts"      "$STAGE/"

# ── package.json — include all deps needed to build ──
cat > "$STAGE/package.json" <<'PKGJSON'
{
  "name": "tripprchalo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "start": "node server.js"
  },
  "dependencies": {
    "lucide-react": "^1.8.0",
    "mysql2": "^3.22.5",
    "next": "16.2.3",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
PKGJSON

# No omit flags — Tailwind v4 needs lightningcss (optional dep) and build needs devDeps
# After build runs on server, runtime only needs production deps
printf "legacy-peer-deps=true\n" > "$STAGE/.npmrc"

# ── setup.sh — one-command build helper for SSH ──
cat > "$STAGE/setup.sh" <<'SETUP'
#!/usr/bin/env bash
# Run this once via SSH after uploading the zip:
#   bash setup.sh
set -e
echo "Installing dependencies (including optional native binaries for Linux)..."
npm install --include=optional
echo "Building Next.js app..."
npm run build
echo ""
echo "Done! Restart the app in hPanel → Node.js → Restart"
SETUP
chmod +x "$STAGE/setup.sh"

# ── server.js — starts the standalone build output ──
cat > "$STAGE/server.js" <<'SERVERJS'
'use strict'
const path = require('path')
const fs   = require('fs')

const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js')

if (!fs.existsSync(standaloneServer)) {
  console.error('───────────────────────────────────────────────')
  console.error('App not built yet. SSH into the server and run:')
  console.error('  npm install && npm run build')
  console.error('Then restart the Node.js app in hPanel.')
  console.error('───────────────────────────────────────────────')
  process.exit(1)
}

require(standaloneServer)
SERVERJS

# ── ecosystem.config.js for PM2 ──
cat > "$STAGE/ecosystem.config.js" <<'PM2'
module.exports = {
  apps: [
    {
      name: 'tripprchale',
      script: 'server.js',
      cwd: '/home/u123456/domains/yourdomain.com/public_nodejs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      watch: false,
      max_memory_restart: '512M',
    },
  ],
}
PM2

# ── Public folder — exclude uploads (those are already on the server) ──
mkdir -p "$STAGE/public/uploads"
find "$ROOT/public" -maxdepth 1 -type f | while read f; do
  cp "$f" "$STAGE/public/"
done

# ── Database SQL files ──
mkdir -p "$STAGE/database"
cp "$ROOT/database/"*.sql "$STAGE/database/" 2>/dev/null || true

# ── Env template ──
cp "$ROOT/.env.local.example" "$STAGE/.env.local.example"

# ── Hostinger deploy guide ──
cat > "$STAGE/HOSTINGER_GUIDE.txt" <<'GUIDE'
════════════════════════════════════════════════════════════════
  TripprChale — Hostinger Source Deploy Guide
════════════════════════════════════════════════════════════════

This is a source-only package. You build the app on the server
via SSH — takes ~2 minutes, only needed once per deployment.

STEP 1 — Upload & Extract
──────────────────────────
  hPanel → File Manager → your app folder (e.g. public_nodejs/)
  Upload tripprchalo-hostinger-source.zip → Right-click → Extract Here

STEP 2 — Create .env.local
────────────────────────────
  Duplicate .env.local.example → rename to .env.local
  Edit and fill in your Hostinger DB credentials:

    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=u123456_yourdbuser
    DB_PASSWORD=your_db_password
    DB_NAME=u123456_tripprchalo
    ADMIN_SECRET=any_random_32char_string
    NODE_ENV=production
    PORT=3000
    HOSTNAME=0.0.0.0

STEP 3 — Set up Database (first deploy only)
──────────────────────────────────────────────
  hPanel → Databases → phpMyAdmin → Import database/schema.sql

  If upgrading existing DB (not fresh install), import instead:
    database/fix-legacy-columns.sql

STEP 4 — Build via SSH
────────────────────────
  SSH into your Hostinger server:
    ssh u123456@yourdomain.com

  Navigate to your app folder:
    cd ~/domains/yourdomain.com/public_nodejs

  Install dependencies and build:
    npm install
    npm run build

  This takes 1-3 minutes. You should see:
    ✓ Compiled successfully
    ✓ Generating static pages (23/23)

STEP 5 — Configure Node.js App Manager
────────────────────────────────────────
  hPanel → Website → Node.js:
    Application root:    ~/domains/yourdomain.com/public_nodejs/
    Startup file:        server.js
    Node.js version:     20.x (or latest LTS)
  → SAVE → RESTART

STEP 6 — Verify
────────────────
  Visit https://yourdomain.com — should load.
  Visit https://yourdomain.com/admin — admin panel.

UPDATING (future deployments)
──────────────────────────────
  1. Upload new source zip → Extract (overwrites source files)
  2. SSH in → npm install && npm run build
  3. hPanel Node.js → Restart
  Note: .env.local and public/uploads/ are preserved.

COMMON ISSUES
──────────────
  "App not built yet" on startup
    → SSH in and run: npm install && npm run build

  502 Bad Gateway
    → hPanel Node.js app may be stopped — click Restart

  Unknown column / DB errors
    → Run database/fix-legacy-columns.sql in phpMyAdmin
    → Check .env.local DB credentials match hPanel DB settings

  Build fails with "out of memory"
    → Contact Hostinger support to increase Node.js memory limit
    → Or use the pre-built zip (tripprchalo-hostinger-latest.zip)
      which doesn't require building on server

════════════════════════════════════════════════════════════════
GUIDE

# ── Zip it ──
rm -f "$OUT/$ZIPNAME"
cd "$STAGE"
zip -r "$OUT/$ZIPNAME" . \
  --exclude "*.DS_Store" \
  --exclude "__MACOSX/*" \
  --exclude ".git/*"
cd "$ROOT"

# Cleanup
rm -rf "$STAGE"

SIZE=$(du -sh "$OUT/$ZIPNAME" | cut -f1)
echo ""
echo "✅ Done!"
echo "   $OUT/$ZIPNAME  ($SIZE)"
echo ""
echo "Upload to hPanel File Manager → Extract → SSH → npm install && npm run build"
echo "See HOSTINGER_GUIDE.txt inside the zip for full steps."
