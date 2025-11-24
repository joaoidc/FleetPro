# 🚗 Sistema de Gestão de Veículos

Sistema completo para gerenciamento de frota de veículos, desenvolvido com **NestJS** (backend) e **Angular** (frontend), com integração de mensageria via **RabbitMQ**.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Executando o Projeto](#executando-o-projeto)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)

---

## 🎯 Sobre o Projeto

Sistema de gestão de veículos que permite o cadastro, consulta, atualização e remoção de veículos de uma frota. O sistema inclui validações robustas, paginação, filtros de busca e notificações em tempo real via mensageria.

### Principais Características

- ✅ **CRUD completo** de veículos
- ✅ **Validações de dados** (placa, chassi, RENAVAM)
- ✅ **Prevenção de duplicatas** (placas únicas)
- ✅ **Paginação** e **filtros** de busca
- ✅ **Documentação automática** com Swagger
- ✅ **Mensageria** com RabbitMQ
- ✅ **Interface moderna** e responsiva
- ✅ **Máscaras de entrada** para campos específicos

---

## 🛠️ Tecnologias

### Backend

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeORM](https://typeorm.io/)** - ORM para TypeScript/JavaScript
- **[SQLite](https://www.sqlite.org/)** - Banco de dados relacional
- **[Swagger](https://swagger.io/)** - Documentação de API
- **[RabbitMQ](https://www.rabbitmq.com/)** - Sistema de mensageria
- **[Class Validator](https://github.com/typestack/class-validator)** - Validação de dados

### Frontend

- **[Angular 16](https://angular.io/)** - Framework web
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript
- **[RxJS](https://rxjs.dev/)** - Programação reativa
- **[Angular Material](https://material.angular.io/)** (opcional) - Componentes UI

---

## ⚡ Funcionalidades

### Gestão de Veículos

- **Cadastro de veículos** com validação de:

  - Placa (formato Mercosul: ABC1D23)
  - Chassi (17 caracteres alfanuméricos)
  - RENAVAM (11 dígitos)
  - Modelo, Marca e Ano

- **Listagem paginada** com:

  - Paginação configurável (padrão: 10 itens por página)
  - Filtros por placa, modelo e marca
  - Ordenação por ID (mais recentes primeiro)

- **Busca individual** por ID
- **Atualização** de dados do veículo
- **Remoção** de veículos
- **Prevenção de duplicatas** - não permite cadastrar veículos com placas repetidas

### Sistema de Notificações

- Notificações em tempo real via RabbitMQ quando um veículo é criado
- Microserviço dedicado para processamento de eventos

---

## 🏗️ Arquitetura

```
vehicle-project/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── vehicles/       # Módulo de veículos
│   │   │   ├── dto/        # Data Transfer Objects
│   │   │   ├── entities/   # Entidades TypeORM
│   │   │   ├── swagger/    # Documentação Swagger
│   │   │   ├── vehicles.controller.ts
│   │   │   ├── vehicles.service.ts
│   │   │   └── vehicles.module.ts
│   │   ├── notifications/  # Módulo de notificações
│   │   └── main.ts
│   ├── database.sqlite     # Banco de dados SQLite
│   └── package.json
│
├── frontend/               # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── models/     # Modelos de dados
│   │   │   ├── services/   # Serviços HTTP
│   │   │   ├── directives/ # Diretivas (máscaras)
│   │   │   └── vehicle-list/ # Componente de listagem
│   │   └── styles.scss
│   └── package.json
│
├── docker-compose.yml      # Orquestração de containers
└── README.md              # Este arquivo
```

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Docker** e **Docker Compose** (opcional, para RabbitMQ)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd vehicle-project
```

### 2. Instale as dependências do Backend

```bash
cd backend
npm install
```

### 3. Instale as dependências do Frontend

```bash
cd ../frontend
npm install
```

---

## ▶️ Executando o Projeto

### Opção 1: Executar com Docker Compose (Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d
```

Isso irá iniciar:

- Backend na porta `3000`
- Frontend na porta `4200`
- RabbitMQ na porta `5672` (Management UI na porta `15672`)

### Opção 2: Executar Localmente

#### Backend

```bash
cd backend
npm run start:dev
```

O backend estará disponível em: `http://localhost:3000`

#### Frontend

```bash
cd frontend
npm start
# ou
ng serve
```

O frontend estará disponível em: `http://localhost:4200`

#### RabbitMQ (Opcional)

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

---

## 📚 Documentação da API

A documentação interativa da API está disponível via Swagger:

**URL:** `http://localhost:3000/api`

### Principais Endpoints

#### Veículos

| Método   | Endpoint        | Descrição                                 |
| -------- | --------------- | ----------------------------------------- |
| `POST`   | `/vehicles`     | Cadastrar novo veículo                    |
| `GET`    | `/vehicles`     | Listar veículos (com paginação e filtros) |
| `GET`    | `/vehicles/:id` | Buscar veículo por ID                     |
| `PATCH`  | `/vehicles/:id` | Atualizar veículo                         |
| `DELETE` | `/vehicles/:id` | Remover veículo                           |

#### Parâmetros de Query (GET /vehicles)

- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `placa` (opcional): Filtrar por placa
- `modelo` (opcional): Filtrar por modelo
- `marca` (opcional): Filtrar por marca

#### Exemplo de Requisição

```bash
# Listar veículos da página 2, com 20 itens, filtrando por marca Toyota
GET http://localhost:3000/vehicles?page=2&limit=20&marca=Toyota
```

#### Exemplo de Resposta (GET /vehicles)

```json
{
  "data": [
    {
      "id": 1,
      "placa": "ABC1D23",
      "chassi": "9BWZZZ377NT004253",
      "renavam": "12345678901",
      "modelo": "Corolla XEi",
      "marca": "Toyota",
      "ano": 2024
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## 📁 Estrutura do Projeto

### Backend (NestJS)

```
backend/src/
├── vehicles/
│   ├── dto/
│   │   ├── create-vehicle.dto.ts      # DTO para criação
│   │   ├── update-vehicle.dto.ts      # DTO para atualização
│   │   ├── filter-vehicle.dto.ts      # DTO para filtros
│   │   └── pagination.dto.ts          # DTO para paginação
│   ├── entities/
│   │   └── vehicle.entity.ts          # Entidade do banco
│   ├── swagger/
│   │   └── vehicle.response.ts        # Schemas Swagger
│   ├── vehicles.controller.ts         # Controlador REST
│   ├── vehicles.service.ts            # Lógica de negócio
│   └── vehicles.module.ts             # Módulo NestJS
└── notifications/
    ├── notifications.controller.ts    # Consumidor RabbitMQ
    └── notifications.module.ts
```

### Frontend (Angular)

```
frontend/src/app/
├── models/
│   └── vehicle.model.ts               # Interface do veículo
├── services/
│   └── vehicle.service.ts             # Serviço HTTP
├── directives/
│   └── mask.directive.ts              # Máscaras de input
└── vehicle-list/
    ├── vehicle-list.component.ts      # Componente principal
    ├── vehicle-list.component.html    # Template
    └── vehicle-list.component.scss    # Estilos
```

---

## 🧪 Testes

### Backend

```bash
cd backend

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

### Frontend

```bash
cd frontend

# Testes unitários
npm test

# Testes e2e
npm run e2e
```

---

## 🔒 Validações Implementadas

### Placa

- Formato Mercosul: 3 letras + 1 número + 1 letra + 2 números (ex: ABC1D23)
- Única no sistema (não permite duplicatas)

### Chassi

- 17 caracteres alfanuméricos
- Apenas letras e números

### RENAVAM

- Exatamente 11 dígitos numéricos

### Modelo e Marca

- Mínimo 2 caracteres
- Máximo 50 caracteres

### Ano

- Número inteiro
- Entre 1900 e ano atual + 1

---

## 🐛 Troubleshooting

### Erro: SQLITE_CANTOPEN

Se encontrar erro ao abrir o banco de dados:

```bash
cd backend
rm -rf database.sqlite  # ou del database.sqlite no Windows
npm run start:dev
```

### Porta 3000 já em uso

```bash
# Encontrar processo usando a porta
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Matar o processo ou mudar a porta em backend/src/main.ts
```

### RabbitMQ não conecta

O sistema funciona normalmente mesmo sem RabbitMQ. Você verá um aviso no console, mas a API continuará operacional.

---

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📞 Suporte

Para questões e suporte, abra uma issue no repositório do projeto.

---

**Desenvolvido com ❤️ usando NestJS e Angular**
