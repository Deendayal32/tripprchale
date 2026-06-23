#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# TripprChale — package-deploy.sh
# Run this on your Mac AFTER `npm run build`.
# It creates  deploy/tripprchale.tar.gz  ready to upload to server.
# ─────────────────────────────────────────────────────────────
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/deploy"
APP="$OUT/tripprchale"

echo "📦 Packaging TripprChale standalone build..."

# Clean previous package
rm -rf "$OUT"
mkdir -p "$APP"

# ── 1. Standalone server (self-contained Node.js app) ──
cp -r "$ROOT/.next/standalone/." "$APP/"

# Overwrite package.json with a clean server-only version (no build step, no Mac-specific devDeps)
cat > "$APP/package.json" <<'PKGJSON'
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

# .npmrc: always omit devDependencies on server
echo "omit=dev" > "$APP/.npmrc"

# ── 2. Static assets (JS/CSS chunks — MUST be in .next/static) ──
mkdir -p "$APP/.next/static"
cp -r "$ROOT/.next/static/." "$APP/.next/static/"

# ── 3. Public folder (images, uploads folder, etc.) ──
mkdir -p "$APP/public/uploads"
cp -r "$ROOT/public/." "$APP/public/"

# ── 4. PM2 config ──
cp "$ROOT/ecosystem.config.js" "$APP/"

# ── 5. Database files ──
mkdir -p "$APP/database"
cp "$ROOT/database/"*.sql "$APP/database/" 2>/dev/null || true

# ── 6. Env template ──
cp "$ROOT/.env.local.example" "$APP/.env.local.example"

# ── 7. Server start script ──
cat > "$APP/start.sh" <<'STARTSCRIPT'
#!/usr/bin/env bash
# Run on server inside /var/www/tripprchale
set -e

if [ ! -f ".env.local" ]; then
  echo "ERROR: .env.local not found. Copy .env.local.example → .env.local and fill in values."
  exit 1
fi

export $(grep -v '^#' .env.local | xargs)

echo "Starting TripprChale on port ${PORT:-3000}..."
node server.js
STARTSCRIPT
chmod +x "$APP/start.sh"

# ── 8. Server setup guide ──
cat > "$APP/DEPLOY_GUIDE.txt" <<'GUIDE'
════════════════════════════════════════════════════════════════
  TripprChale — Server Setup Guide
════════════════════════════════════════════════════════════════

PREREQUISITES ON SERVER
───────────────────────
  • Ubuntu 20.04+ / CentOS 7+
  • Node.js 20+ (install via nvm: https://github.com/nvm-sh/nvm)
  • MySQL 8.0+
  • PM2  →  npm install -g pm2
  • Nginx (optional but recommended for HTTPS / domain)

STEP 1 — Upload files
───────────────────────
  scp tripprchale.tar.gz user@your-server:/tmp/
  ssh user@your-server
  sudo mkdir -p /var/www/tripprchale
  sudo tar -xzf /tmp/tripprchale.tar.gz -C /var/www/tripprchale --strip-components=1
  sudo chown -R $USER:$USER /var/www/tripprchale

STEP 2 — Set up MySQL
───────────────────────
  mysql -u root -p
    CREATE DATABASE tripprchale CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    CREATE USER 'tripprchale_user'@'localhost' IDENTIFIED BY 'your_strong_password';
    GRANT ALL PRIVILEGES ON tripprchale.* TO 'tripprchale_user'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;

  # If fresh install (no existing DB):
  mysql -u tripprchale_user -p tripprchale < /var/www/tripprchale/database/schema.sql

  # If you have an EXISTING DB and just need to add slug/tagline columns:
  mysql -u tripprchale_user -p tripprchale < /var/www/tripprchale/database/migrate-add-slug.sql

STEP 3 — Create .env.local
───────────────────────────
  cd /var/www/tripprchale
  cp .env.local.example .env.local
  nano .env.local
  # Fill in: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, ADMIN_SECRET

STEP 4 — Start with PM2
───────────────────────
  cd /var/www/tripprchale
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup   # follow the printed command to auto-start on reboot

  # Check it's running:
  pm2 status
  curl http://localhost:3000

STEP 5 — Nginx reverse proxy (recommended)
───────────────────────────────────────────
  sudo nano /etc/nginx/sites-available/tripprchale

  Paste:
  ──────────────────────────────────────────
  server {
      listen 80;
      server_name yourdomain.com www.yourdomain.com;

      location /_next/static/ {
          alias /var/www/tripprchale/.next/static/;
          expires 1y;
          add_header Cache-Control "public, immutable";
      }

      location /uploads/ {
          alias /var/www/tripprchale/public/uploads/;
          expires 7d;
      }

      location / {
          proxy_pass         http://127.0.0.1:3000;
          proxy_http_version 1.1;
          proxy_set_header   Upgrade $http_upgrade;
          proxy_set_header   Connection 'upgrade';
          proxy_set_header   Host $host;
          proxy_set_header   X-Real-IP $remote_addr;
          proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header   X-Forwarded-Proto $scheme;
          proxy_cache_bypass $http_upgrade;
      }
  }
  ──────────────────────────────────────────

  sudo ln -s /etc/nginx/sites-available/tripprchale /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl restart nginx

STEP 6 — HTTPS with Let's Encrypt (free SSL)
─────────────────────────────────────────────
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

COMMON PM2 COMMANDS
───────────────────
  pm2 restart tripprchale    # restart app
  pm2 logs tripprchale       # view live logs
  pm2 stop tripprchale       # stop app
  pm2 monit                  # live dashboard

UPLOADED IMAGES
───────────────
  Images uploaded via admin panel are stored in:
    /var/www/tripprchale/public/uploads/
  These are NOT included in future deployments — back them up separately.

════════════════════════════════════════════════════════════════
GUIDE

# ── 9. Tar it up ──
cd "$OUT"
tar -czf tripprchale.tar.gz tripprchale/
rm -rf tripprchale/

echo ""
echo "✅ Done! Deployment package ready:"
echo "   $OUT/tripprchale.tar.gz"
echo ""
echo "Upload to server:"
echo "   scp $OUT/tripprchale.tar.gz user@your-server:/tmp/"
echo ""
echo "See DEPLOY_GUIDE.txt inside the archive for full setup steps."
