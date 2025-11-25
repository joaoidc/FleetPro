FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN apk add --no-cache python3 make g++

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

RUN npm ci --only=production

RUN npm rebuild sqlite3

ENV DATABASE_PATH=/app/data/db.sqlite
RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
