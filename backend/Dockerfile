FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src


RUN apk add --no-cache python3 make g++

RUN npm install

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --production
RUN npm rebuild sqlite3

ENV DATABASE_PATH=/app/data/db.sqlite
RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
