# Nuxt Task Manager - Vitest Learning Project

A fullstack task management app built as a hands-on learning project to practice modern testing
in Nuxt 4. The goal wasn't to build the most feature-rich app - it was to understand how to write
unit, integration, and E2E tests for a real-world Nuxt project with a PostgreSQL database. Every
feature in this app exists to give something meaningful to test.

---

## Tech Stack

- **Framework** - Nuxt 4
- **Database** - PostgreSQL (via Docker)
- **ORM** - Drizzle ORM
- **Auth** - nuxt-auth-utils
- **State** - Pinia
- **Validation** - Zod
- **Unit & Integration Tests** - Vitest
- **E2E Tests** - Playwright
- **Package Manager** - Yarn

---

## Features

- User registration and login (session-based auth)
- Create, complete, and delete tasks
- Task priorities (low / medium / high)
- Search and filter tasks
- Auto-sorted task list (by completion, priority, date)
- Task statistics (total / completed / pending)

---

## Test Coverage

| Layer       | Tool                      | What's Tested                                                                       |
| ----------- | ------------------------- | ----------------------------------------------------------------------------------- |
| Unit        | Vitest                    | Pure service functions (`sortTasks`, `filterTasks`, `getTaskStats`, password utils) |
| Integration | Vitest + @nuxt/test-utils | Auth endpoints, task CRUD API, middleware, validation                               |
| E2E         | Playwright                | Full browser flows - register, login, create/complete/delete tasks, search          |

---

## Local Setup

### Prerequisites

- Node.js 20+
- Yarn 4+
- Docker + Docker Compose

### 1. Clone and install

bash
git clone https://github.com/Theekshana-Bandara-Intrepid/nuxt-task-manager.git
cd nuxt-task-manager
yarn install

### 2. Environment files

bash
cp .env.example .env
cp .env.example .env.test

Edit `.env` and `.env.test` with your values. `.env.test` should point to the test database (port `5433`).

### 3. Start databases

bash
docker compose up -d

This starts two PostgreSQL containers - one for development (`5432`) and one for tests (`5433`).

### 4. Run migrations

bash

# Dev database

yarn drizzle-kit push

# Test database

dotenv -e .env.test -- yarn drizzle-kit push

### 5. Start the dev server

bash
yarn dev

---

## Running Tests

bash

# Unit tests only (fast, no DB required)

yarn test:unit

# Unit tests in watch mode (re-runs on save)

yarn test:unit:watch

# Unit tests with coverage report

yarn test:unit:coverage

# Integration tests (requires Docker running)

yarn test:integration

# E2E tests (requires Docker + dev server)

yarn test:e2e

# E2E tests with browser visible

yarn test:e2e:ui

# Run everything

yarn test:all

---

## Environment Variables

See `.env.example` for all required variables.

DATABASE_URL=postgresql://user:pass@localhost:5432/taskmanager
NUXT_SESSION_PASSWORD=your-secret-32-chars-minimum

---

## Git Branch Strategy

Each feature and test phase lives in its own branch and is merged to `main` via pull request.

main
├── feat/docker-db
├── feat/schema
├── feat/api-routes
├── feat/frontend
├── test/unit
├── test/integration
└── test/e2e
