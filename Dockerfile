# Multi-Stage Production Dockerfile for DukaanPay AI (Full Stack: Next.js UI + Express Backend)
# Stage 1: Build Frontend and Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install native compilation tools for argon2
RUN apk add --no-cache python3 make g++ gcc libc-dev

# 1. Build Backend
COPY backend/ ./backend/
RUN cd backend && npm ci && npm run build

# 2. Build Frontend (Next.js 16)
COPY package*.json ./
RUN npm ci

COPY tsconfig*.json next.config.ts postcss.config.mjs eslint.config.mjs ./
COPY public/ ./public/
COPY ml/ ./ml/
COPY src/ ./src/
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV PORT=3000

# Copy built backend with compiled native dependencies (e.g. argon2)
COPY --from=builder /app/backend ./backend

# Copy built frontend with runtime dependencies and Next.js build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/ml ./ml
COPY --from=builder /app/next.config.ts ./next.config.ts

# Startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose Render default port (3000) and Backend internal port (4000)
EXPOSE 3000
EXPOSE 4000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["./start.sh"]
