# ----------
# Dockerfile for User Service (Scalable-Service-Grp-6) targeting Node v22.14.0
# Multi-stage build to compile TypeScript and run production image
# ----------

# 1) Build stage
FROM node:22.14.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package manifests and TS config
COPY package*.json tsconfig.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY src ./src

# Compile TypeScript to JavaScript in /app/dist
RUN npm run build


# 2) Production stage
FROM node:22.14.0-alpine

WORKDIR /app

# Copy only package manifests for production deps
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy compiled output from build stage
COPY --from=builder /app/dist ./dist

# Do not include .env in image; pass env vars at runtime via Kubernetes ConfigMap/Secret

# Expose service and inter-service ports
EXPOSE 4000
EXPOSE 4001

# Start the server
# Assumes your compiled entrypoint is dist/server.js
CMD ["node", "dist/server.js"]