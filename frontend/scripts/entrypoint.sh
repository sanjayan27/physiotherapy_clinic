#!/bin/sh
set -eu

# Load .env if present so we can read NEXT_PUBLIC_BACKEND_API_URL without docker -e
if [ -f /app/.env ]; then
  # Export variables defined in .env into this shell
  set -a
  . /app/.env
  set +a
fi

# Generate a runtime env file consumed by the client bundle
# Prefer env var (possibly from .env above); fallback to localhost
BACKEND_URL="${NEXT_PUBLIC_BACKEND_API_URL:-http://localhost:5000}"

cat > /app/public/env.js <<EOF
window.__ENV = {
  NEXT_PUBLIC_BACKEND_API_URL: "${BACKEND_URL}"
};
console.info('[env.js] NEXT_PUBLIC_BACKEND_API_URL =', window.__ENV.NEXT_PUBLIC_BACKEND_API_URL);
EOF

# Start Next.js
exec npm start
