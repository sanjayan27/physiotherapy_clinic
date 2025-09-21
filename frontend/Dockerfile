# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy rest and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Copy build artifacts from builder
COPY --from=builder /app . 

EXPOSE 3000
CMD ["npm", "start"]
