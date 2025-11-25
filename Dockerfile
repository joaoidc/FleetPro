FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./
COPY backend/src ./src
RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache nginx supervisor python3 make g++ sqlite rabbitmq-server

WORKDIR /app/backend
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/package*.json ./

RUN npm install --production
RUN npm rebuild sqlite3

RUN rm -rf /usr/share/nginx/html/*
COPY --from=frontend-builder /app/frontend/dist/frontend /usr/share/nginx/html

RUN mkdir -p /run/nginx

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://127.0.0.1:3000/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
}' > /etc/nginx/http.d/default.conf

RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisord.conf

RUN mkdir -p /app/data && chown -R node:node /app/data

RUN mkdir -p /var/lib/rabbitmq /var/log/rabbitmq
RUN chown -R rabbitmq:rabbitmq /var/lib/rabbitmq /var/log/rabbitmq
ENV RABBITMQ_PID_FILE=/var/lib/rabbitmq/mnesia/rabbitmq
RUN mkdir -p /etc/rabbitmq && \
    rabbitmq-plugins enable rabbitmq_management

EXPOSE 80 5672 15672

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
