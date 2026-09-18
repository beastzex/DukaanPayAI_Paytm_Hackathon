# Multi-Stage Production Dockerfile for DukaanPayAI Enterprise Backend
# Stage 1: Build & Prune
FROM node:20-alpine AS builder

WORKDIR /app

# Install native dependencies required for argon2 compilation
RUN apk add --no-cache python3 make g++ gcc libc-dev

COPY package*.json tsconfig*.json ./
RUN npm ci

COPY src/ ./src/
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Install runtime dependencies for argon2 and security hardening
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV PORT=3000

# Create unprivileged system user for OWASP container security
RUN addgroup -S dukaanpay && adduser -S dukaanpay -G dukaanpay

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=dukaanpay:dukaanpay /app/dist ./dist

# Switch to unprivileged user
USER dukaanpay

EXPOSE 3000

# Use dumb-init to properly forward signals to node processes for graceful shutdown
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]
