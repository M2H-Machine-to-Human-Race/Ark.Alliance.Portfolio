# ═══════════════════════════════════════════════════════════════════════
# Ark.Portfolio - Hugging Face Spaces Docker Deployment
# ═══════════════════════════════════════════════════════════════════════

# Stage 1: Build Shared Library
FROM node:22-alpine AS share-builder
WORKDIR /app/share
COPY Ark.Portfolio.Share/package*.json ./
RUN npm ci
COPY Ark.Portfolio.Share/ ./
RUN npm run build

# Stage 2: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY --from=share-builder /app/share /app/Ark.Portfolio.Share
WORKDIR /app/frontend
COPY Ark.Portfolio.UI/package*.json ./
RUN npm ci
COPY Ark.Portfolio.UI/ ./
ENV VITE_API_URL=/api
ENV VITE_USE_MOCK_DATA=false
RUN npm run build

# Stage 3: Build Backend
FROM node:22-alpine AS backend-builder
WORKDIR /app
COPY --from=share-builder /app/share /app/Ark.Portfolio.Share
WORKDIR /app/backend
COPY Ark.Portfolio.Backend/package*.json ./
RUN npm ci
COPY Ark.Portfolio.Backend/ ./
RUN npm run build

# Stage 4: Production Runtime
FROM node:22-alpine AS production
RUN apk add --no-cache nginx

WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package.json ./
COPY --from=backend-builder /app/Ark.Portfolio.Share /app/Ark.Portfolio.Share

# Copy frontend static files
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy backend assets (using RUN to handle missing directory gracefully)
RUN mkdir -p ./dist/Assets

# Create data directory for SQLite
RUN mkdir -p /app/data

# HF Spaces runs as user 1000
RUN chown -R 1000:1000 /app /usr/share/nginx/html /var/lib/nginx /var/log/nginx

# Environment defaults
ENV PORT=3085
ENV NODE_ENV=production
ENV DATABASE_TYPE=sqlite
ENV DATABASE_NAME=/app/data/portfolio.db

# Expose HF Spaces default port
EXPOSE 7860

# Start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

USER 1000
CMD ["/app/start.sh"]
