<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS Authentication with JWT

A production-ready NestJS application implementing JWT authentication with TypeORM, PostgreSQL, and comprehensive code quality tools.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Docker](#docker)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Code Quality & Git Hooks](#code-quality--git-hooks)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

## ✨ Features

- 🔐 **JWT Authentication** - Secure authentication using Passport.js and JWT
- 🔒 **Password Encryption** - Bcrypt password hashing
- 🗃️ **Database ORM** - TypeORM with PostgreSQL
- 🐳 **Docker Support** - Complete containerization with Docker Compose
- 🎯 **Clean Code** - Follows Uncle Bob's Clean Code principles
- 🔍 **Code Quality** - ESLint, Prettier, and Husky pre-commit hooks
- 📝 **Commit Conventions** - Commitlint for conventional commits
- 🔀 **Branch Validation** - Automatic branch name validation
- ✅ **Testing** - Jest for unit and E2E tests
- 📚 **API Documentation** - HTTP files for testing endpoints

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Authentication**: Passport.js + JWT
- **Validation**: Class Validator & Class Transformer
- **Testing**: Jest
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **pnpm** >= 8.x
- **Docker** & **Docker Compose** (for containerized setup)
- **Git**

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installations
node --version
pnpm --version
docker --version
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mx444/nestjs-auth-jwt.git
cd nestjs-auth-jwt
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp example.env .env
```

Edit `.env` with your configuration:

```env
# General
NODE_ENV=development

# NestJS
NESTJS_PORT=1337

# Database Development
DB_HOST_DEV=localhost
DB_PORT_DEV=5432
DB_USER_DEV=dev_user
DB_PASSWORD_DEV=dev_password
DB_NAME_DEV=nestjs_auth_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
```

### 4. Start Development Server

**Option A: Local Development (requires PostgreSQL installed)**

```bash
pnpm start:dev
```

**Option B: Docker Development (recommended)**

```bash
# Start all services (PostgreSQL + NestJS)
pnpm docker:up

# View logs
pnpm docker:logs

# Stop all services
pnpm docker:down
```

The API will be available at `http://localhost:1337`

## 💻 Development

### Available Scripts

```bash
# Development
pnpm start:dev          # Start with hot-reload
pnpm start:debug        # Start in debug mode
pnpm start:prod         # Start production build

# Building
pnpm build              # Build the application

# Code Quality
pnpm format             # Format code with Prettier
pnpm lint               # Lint and fix code with ESLint
pnpm lint:fix           # Auto-fix linting issues

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Generate coverage report
pnpm test:e2e           # Run end-to-end tests
```

## 🐳 Docker

### Docker Commands

```bash
# Start containers in detached mode
pnpm docker:up

# Stop and remove containers
pnpm docker:down

# View container logs
pnpm docker:logs

# Run migrations in Docker
pnpm docker:migrate
```

### Docker Services

- **postgres**: PostgreSQL 16 database (port 5432)
- **app**: NestJS application (port 1337)
- **migrations**: Migration runner service

## 🗄️ Database Migrations

### Migration Commands

```bash
# Generate a new migration
pnpm migration:generate src/database/migrations/MigrationName

# Create an empty migration
pnpm migration:create src/database/migrations/MigrationName

# Run pending migrations
pnpm migration:run

# Revert last migration
pnpm migration:revert
```

### Migration Workflow

1. Make changes to your entities
2. Generate migration: `pnpm migration:generate src/database/migrations/AddUserTable`
3. Review the generated migration file
4. Apply migration: `pnpm migration:run`

## ✅ Testing

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

### HTTP Files for Manual Testing

Located in `src/auth/http/`:

- `auth-register.http` - User registration
- `auth-login.http` - User login
- `auth-profile.http` - Get user profile (protected)

Use the [httpYac](https://marketplace.visualstudio.com/items?itemName=anweber.vscode-httpyac) extension in VS Code to run these requests.

## 🎯 Code Quality & Git Hooks

This project uses **Husky** to enforce code quality standards before commits.

### Pre-commit Hook

Automatically runs before each commit:

```bash
✓ Prettier formatting
✓ ESLint linting
✓ Branch name validation
```

### Commit Message Validation

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user registration endpoint
fix: resolve JWT token expiration issue
docs: update API documentation
chore: update dependencies
```

**Valid commit types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Branch Naming Convention

Valid branch patterns:

- `main` - Main branch
- `develop` - Development branch
- `feat/feature-name` - New features
- `feat/feature-name/sub-feature` - Feature with sub-feature
- `release/v1.0.0` - Release branches
- `bugfix/bug-description` - Bug fixes
- `chore/task-description` - Maintenance tasks
- `docs/documentation-name` - Documentation updates

### Bypassing Hooks (Not Recommended)

```bash
# Skip pre-commit hooks
git commit --no-verify -m "message"

# Skip all hooks
git push --no-verify
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/register` | Register new user | No            |
| POST   | `/auth/login`    | Login user        | No            |
| GET    | `/auth/profile`  | Get user profile  | Yes (JWT)     |

### Example Requests

**Register**

```bash
POST http://localhost:1337/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Login**

```bash
POST http://localhost:1337/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Get Profile**

```bash
GET http://localhost:1337/auth/profile
Authorization: Bearer <your-jwt-token>
```

## 📁 Project Structure

```
nestjs-auth-jwt/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── controllers/         # Auth controllers
│   │   ├── dtos/                # Data Transfer Objects
│   │   ├── entities/            # User entity
│   │   ├── guards/              # JWT guard
│   │   ├── http/                # HTTP test files
│   │   ├── interfaces/          # TypeScript interfaces
│   │   ├── providers/           # Services (AuthService, BcryptProvider)
│   │   ├── repositories/        # User repository
│   │   ├── strategies/          # Passport JWT strategy
│   │   └── auth.module.ts       # Auth module
│   ├── config/                  # Configuration files
│   │   └── typeorm.config.ts    # TypeORM configuration
│   ├── database/                # Database module
│   │   ├── migrations/          # Database migrations
│   │   ├── repository/          # Abstract repository
│   │   └── database.module.ts   # Database module
│   ├── schemas/                 # Validation schemas (Zod)
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Application entry point
├── test/                        # E2E tests
├── .husky/                      # Git hooks
├── docker-compose.yml           # Docker services
├── Dockerfile                   # App container
└── package.json                 # Dependencies and scripts
```

## 🔐 Environment Variables

| Variable          | Description          | Default           |
| ----------------- | -------------------- | ----------------- |
| `NODE_ENV`        | Environment mode     | `development`     |
| `NESTJS_PORT`     | Application port     | `1337`            |
| `DB_HOST_DEV`     | Database host        | `localhost`       |
| `DB_PORT_DEV`     | Database port        | `5432`            |
| `DB_USER_DEV`     | Database username    | `dev_user`        |
| `DB_PASSWORD_DEV` | Database password    | `dev_password`    |
| `DB_NAME_DEV`     | Database name        | `nestjs_auth_dev` |
| `JWT_SECRET`      | JWT secret key       | -                 |
| `JWT_EXPIRES_IN`  | JWT token expiration | `1h`              |

## 📝 License

This project is [MIT licensed](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues and questions, please open an issue in the [GitHub repository](https://github.com/Mx444/nestjs-auth-jwt/issues).
