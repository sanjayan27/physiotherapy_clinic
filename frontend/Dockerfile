# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies needed by sharp
RUN apk add --no-cache \
    python3 \
    g++ \
    make \
    libc6-compat \
    vips-dev

# Install npm dependencies
COPY package*.json ./
RUN npm ci
# Copy rest of the app and build
COPY . .
RUN npm run build

# Prune development dependencies to reduce image size and improve security
RUN npm prune --production

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Set Node.js environment to production
ENV NODE_ENV=production
# Render uses the PORT environment variable, setting a default is good practice
ENV PORT 3000

# Install runtime dependencies for sharp
RUN apk add --no-cache vips

# Create a non-root user for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only necessary artifacts from the builder stage and set ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to the non-root user
USER nextjs

EXPOSE 3000
CMD ["npm", "start"]
