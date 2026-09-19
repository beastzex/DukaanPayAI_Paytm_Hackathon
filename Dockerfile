# Multi-Stage Production Dockerfile for DukaanPay AI (Full Stack: Next.js UI + Express Backend)
# Stage 1: Build Frontend and Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install native compilation tools for argon2
RUN apk add --no-cache python3 make g++ gcc libc-dev

# 1. Build Backend
COPY backend/package*.json ./backend/
COPY backend/tsconfig*.json ./backend/
RUN cd backend && npm ci

COPY backend/src/ ./backend/src/
RUN cd backend && npm run build

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

# Copy built backend
COPY --from=builder /app/backend/package*.json ./backend/
RUN cd backend && npm ci --only=production && npm cache clean --force
COPY --from=builder /app/backend/dist ./backend/dist

# Copy built frontend
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force
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
