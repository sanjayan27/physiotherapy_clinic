# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
CMD npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev   # only production deps

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
