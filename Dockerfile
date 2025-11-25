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

RUN apk add --no-cache nginx supervisor python3 make g++ sqlite

WORKDIR /app/backend
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/package*.json ./

RUN npm install --production
RUN npm rebuild sqlite3

RUN rm -rf /usr/share/nginx/html/*
COPY --from=frontend-builder /app/frontend/dist/frontend /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://localhost:3000/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
}' > /etc/nginx/http.d/default.conf

RUN mkdir -p /var/log/supervisor
RUN echo '[supervisord] \
nodaemon=true \
\
[program:nginx] \
command=nginx -g "daemon off;" \
autorestart=true \
stdout_logfile=/dev/stdout \
stdout_logfile_maxbytes=0 \
stderr_logfile=/dev/stderr \
stderr_logfile_maxbytes=0 \
\
[program:backend] \
command=npm run start:prod \
directory=/app/backend \
autorestart=true \
stdout_logfile=/dev/stdout \
stdout_logfile_maxbytes=0 \
stderr_logfile=/dev/stderr \
stderr_logfile_maxbytes=0 \
environment=DATABASE_PATH="/app/data/db.sqlite" \
' > /etc/supervisord.conf

RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
