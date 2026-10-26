FROM node:20-alpine
WORKDIR /app

# Sadece üretim bağımlılıklarını kur
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# WebSocket kodunu kopyala
COPY ws-server.ts ./

# tsx'i global olarak kur (TypeScript'i çalıştırmak için)
RUN npm install -g tsx

EXPOSE 8080
CMD ["tsx", "ws-server.ts"]