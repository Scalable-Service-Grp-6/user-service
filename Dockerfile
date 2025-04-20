# 1) Build stage
FROM node:22.14.0-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build


# 2) Production stage
FROM node:22.14.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 4000
EXPOSE 4001
CMD ["node", "dist/server.js"]