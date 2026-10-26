# =========================================
# Aşama 1: Bağımlılıkları Kur
# =========================================
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# =========================================
# Aşama 2: Derle
# =========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# =========================================
# Aşama 3: Çalıştır
# =========================================
# =========================================
# Aşama 3: Çalıştır
# =========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# TÜM node_modules'ü kopyala (Prisma CLI ve bağımlılıkları için)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma.config.ts ./

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]