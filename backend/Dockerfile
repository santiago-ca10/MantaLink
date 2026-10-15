# ---------- Etapa 1: compilar ----------
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Etapa 2: imagen final (solo lo necesario para correr) ----------
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
# No correr como root dentro del contenedor
USER node
EXPOSE 3000
# El seed es idempotente (no duplica nada), así que es seguro correrlo en cada arranque
CMD ["sh", "-c", "node dist/database/seed/seed.js && node dist/main.js"]
