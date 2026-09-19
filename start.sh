#!/bin/sh
echo "🚀 Starting DukaanPay AI Unified Production Container..."

# 1. Start Express Backend on internal port 4000
echo "📦 Starting Express Backend on port 4000..."
(cd /app/backend && PORT=4000 node dist/server.js) &

# 2. Start Next.js Frontend & Webhook API on Render's assigned $PORT
PORT_TO_USE="${PORT:-3000}"
echo "🌐 Starting Next.js UI & Webhooks on port ${PORT_TO_USE}..."
cd /app && npx next start -p "${PORT_TO_USE}" -H 0.0.0.0
