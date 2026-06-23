module.exports = {
  apps: [
    {
      name: 'tripprchale',
      script: './server.js',
      cwd: '/var/www/tripprchale',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      watch: false,
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/tripprchale-error.log',
      out_file:   '/var/log/pm2/tripprchale-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
