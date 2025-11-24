FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Instalar dependências de compilação para sqlite3
RUN apk add --no-cache python3 make g++
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Instalar dependências de produção e sqlite3 novamente para garantir compatibilidade
RUN apk add --no-cache python3 make g++
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --production
# Forçar rebuild do sqlite3 se necessário
RUN npm rebuild sqlite3

# Definir variável de ambiente para o caminho do banco
ENV DATABASE_PATH=/app/data/db.sqlite
# Criar diretório de dados
RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
