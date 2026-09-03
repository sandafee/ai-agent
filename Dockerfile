# ===================================================
# Stage 1: Build React Frontend
# ===================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci || npm install

COPY frontend/ ./
RUN npm run build

# ===================================================
# Stage 2: Install Production Backend Dependencies
# ===================================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --only=production || npm install --only=production

COPY backend/ ./

# ===================================================
# Stage 3: Final Production Image (Nginx + Node.js)
# ===================================================
FROM node:20-alpine

# Install Nginx & Supervisor
RUN apk add --no-cache nginx supervisor

WORKDIR /app

# Copy Frontend static dist to Nginx root
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy Backend app & Database schema/seed
COPY --from=backend-builder /app/backend /app/backend
COPY database /app/database
COPY .env /app/.env

# Copy Nginx & Supervisor configuration
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

# Expose HTTP port
EXPOSE 80 5000

# Start Supervisor to run Backend & Nginx
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
