#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# TripprChale — package-deploy.sh
# Run this on your Mac AFTER `npm run build`.
# Produces:
#   deploy/tripprchalo-hostinger-latest.zip   ← upload to Hostinger File Manager
#   deploy/tripprchale.tar.gz                 ← for Linux SCP deploy
# ─────────────────────────────────────────────────────────────
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/deploy"
STAGE="$OUT/_stage"

echo "📦 Packaging TripprChale standalone build..."

# Clean previous staging area
rm -rf "$STAGE"
mkdir -p "$STAGE"

# ── 1. Standalone server (self-contained Node.js app) ──
cp -r "$ROOT/.next/standalone/." "$STAGE/"

# ── 2. Static assets (JS/CSS chunks — must sit at .next/static) ──
mkdir -p "$STAGE/.next/static"
cp -r "$ROOT/.next/static/." "$STAGE/.next/static/"

# ── 3. Public folder (images, logo, favicon, uploads, etc.) ──
mkdir -p "$STAGE/public/uploads"
cp -r "$ROOT/public/." "$STAGE/public/"

# ── 4. PM2 config ──
cp "$ROOT/ecosystem.config.js" "$STAGE/"

# ── 5. Database SQL files ──
mkdir -p "$STAGE/database"
cp "$ROOT/database/"*.sql "$STAGE/database/" 2>/dev/null || true

# ── 6. Env template ──
cp "$ROOT/.env.local.example" "$STAGE/.env.local.example"

# ── 7. Clean package.json — only prod dependencies, no build step ──
cat > "$STAGE/package.json" <<'PKGJSON'
{
  "name": "tripprchalo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "echo \"App is pre-built. Skipping.\"",
    "start": "node server.js"
  },
  "dependencies": {
    "lucide-react": "^1.8.0",
    "mysql2": "^3.22.5",
    "next": "16.2.3",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}
PKGJSON

# .npmrc: omit devDependencies if npm install is ever run on server
echo "omit=dev" > "$STAGE/.npmrc"

# ── 8. Quick-start script ──
cat > "$STAGE/start.sh" <<'STARTSCRIPT'
#!/usr/bin/env bash
# Run on server inside your app directory
set -e
if [ ! -f ".env.local" ]; then
  echo "ERROR: .env.local not found. Copy .env.local.example → .env.local and fill in values."
  exit 1
fi
export $(grep -v '^#' .env.local | xargs)
echo "Starting TripprChale on port ${PORT:-3000}..."
node server.js
STARTSCRIPT
chmod +x "$STAGE/start.sh"

# ── 9. Hostinger deploy guide ──
cat > "$STAGE/HOSTINGER_GUIDE.txt" <<'GUIDE'
════════════════════════════════════════════════════════════════
  TripprChale — Hostinger Business Node.js Deployment Guide
════════════════════════════════════════════════════════════════

STEP 1 — Upload & Extract
──────────────────────────
  1. Log in to hPanel → File Manager
  2. Navigate to your app folder (e.g. /home/u123456/domains/yourdomain.com/public_nodejs/)
     OR wherever Node.js App Manager points your app root
  3. Upload  tripprchalo-hostinger-latest.zip
  4. Right-click → Extract → Extract Here
     (Files land directly in the folder — server.js, .next/, public/, etc.)

STEP 2 — Create .env.local
────────────────────────────
  In File Manager, copy .env.local.example → .env.local
  Edit .env.local and set:

    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=your_hostinger_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    ADMIN_SECRET=any_random_string_32_chars_minimum
    NODE_ENV=production
    PORT=3000
    HOSTNAME=0.0.0.0

STEP 3 — Set up Database (first time only)
───────────────────────────────────────────
  In hPanel → Databases → phpMyAdmin:
    • Import  database/schema.sql  to create all tables fresh
    OR
    • If DB already exists and just needs new columns:
        Import  database/fix-legacy-columns.sql

STEP 4 — Configure Node.js App Manager
────────────────────────────────────────
  In hPanel → Website → Node.js:
    • Application root: /home/u123456/domains/yourdomain.com/public_nodejs/
                         (wherever you extracted the zip)
    • Application URL:  yourdomain.com
    • Application startup file:  server.js
    • Node.js version: 20.x (or latest LTS)
  Click SAVE → then RESTART

STEP 5 — Verify
────────────────
  Visit https://yourdomain.com — site should load.
  Visit https://yourdomain.com/admin — admin panel.

UPDATING (future deploys)
──────────────────────────
  1. Upload new tripprchalo-hostinger-latest.zip → Extract (overwrites files)
  2. In hPanel Node.js App Manager → RESTART
  Note: .env.local and public/uploads/ are NOT overwritten — they're safe.

COMMON ISSUES
──────────────
  502 Bad Gateway   → Check hPanel Node.js → app may be stopped, click Restart
  DB errors         → Verify .env.local DB credentials match hPanel DB settings
  Missing columns   → Run database/fix-legacy-columns.sql in phpMyAdmin
  White page        → Check Node.js app logs in hPanel

════════════════════════════════════════════════════════════════
GUIDE

# ── 10. Create Hostinger zip (files at zip root — no subfolder) ──
ZIPNAME="tripprchalo-hostinger-latest.zip"
rm -f "$OUT/$ZIPNAME"
cd "$STAGE"
zip -r "$OUT/$ZIPNAME" . --exclude "*.DS_Store" --exclude "__MACOSX/*"
cd "$ROOT"

# ── 11. Also create tar.gz for SCP / Linux deploy ──
cd "$OUT"
rm -rf tripprchale
cp -r "$STAGE" tripprchale
tar -czf tripprchale.tar.gz tripprchale/
rm -rf tripprchale
cd "$ROOT"

# Cleanup staging
rm -rf "$STAGE"

echo ""
echo "✅ Done! Deployment packages ready:"
echo ""
echo "  Hostinger File Manager:"
echo "    $OUT/$ZIPNAME"
echo "    → Upload to hPanel File Manager → Extract Here"
echo ""
echo "  Linux / SCP deploy:"
echo "    $OUT/tripprchale.tar.gz"
echo ""
echo "See HOSTINGER_GUIDE.txt inside the zip for full setup steps."
