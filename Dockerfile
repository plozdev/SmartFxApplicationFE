# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy files from builder
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY server.ts ./

# Install production dependencies
RUN npm install --only=production && npm install -g tsx

# Expose port
EXPOSE 3000

# Start server
CMD ["tsx", "server.ts"]
