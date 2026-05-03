# ---------- BUILD STAGE ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Run app
CMD ["node", "dist/main.js"]