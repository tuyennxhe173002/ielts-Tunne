# LMS Platform

Public LMS monorepo for:
- IELTS
- TOEIC
- Japanese
- Korean

This repository contains:
- Next.js frontend
- NestJS backend API
- PostgreSQL schema via Prisma
- Bunny Stream integration foundation
- admin CMS
- student learning area
- approval workflow
- enrollment control
- progress tracking
- comments and moderation

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- TypeScript
- REST API

### Database
- PostgreSQL
- Prisma ORM

### Video
- Bunny Stream

### Infra
- Vercel for frontend
- Railway for backend
- Neon for PostgreSQL

---

## Monorepo Structure

```text
lms-platform/
├─ apps/
│  ├─ api/
│  └─ web/
├─ packages/
│  ├─ contracts/
│  ├─ eslint-config/
│  └─ tsconfig/
├─ prisma/
├─ docs/
├─ infra/
├─ .vscode/
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
└─ tsconfig.base.json
```

---

## Backend Structure

```text
apps/api/src/
├─ main.ts
├─ app.module.ts
├─ bootstrap/
├─ common/
├─ config/
├─ database/
├─ infrastructure/
├─ integrations/
├─ modules/
│  ├─ iam/
│  ├─ lms/
│  ├─ operations/
│  └─ health/
└─ shared/
```

### Important backend folders

- `bootstrap/` — app startup wiring
- `common/` — guards, decorators, utils, shared types
- `config/` — env-based config files
- `database/` — Prisma entry layer
- `infrastructure/` — low-level technical services
- `integrations/` — Bunny, storage, email, analytics, monitoring
- `modules/iam/` — auth, users, roles, sessions
- `modules/lms/` — courses, sections, lessons, resources, enrollments, progress, comments
- `modules/operations/` — approvals, notifications, audit logs, jobs, webhooks

---

## Frontend Structure

```text
apps/web/
├─ app/
│  ├─ (public)/
│  ├─ (student)/
│  ├─ (admin)/
│  └─ api/
├─ src/
│  ├─ components/
│  ├─ features/
│  ├─ lib/
│  ├─ providers/
│  ├─ config/
│  ├─ server/
│  ├─ hooks/
│  ├─ styles/
│  └─ types/
└─ e2e/
```

### Important frontend folders

- `app/` — route tree and layout only
- `src/features/` — feature-first UI logic
- `src/lib/api/` — HTTP clients
- `src/lib/auth/` — token/session helpers
- `src/components/` — reusable UI/layout/shared components
- `src/providers/` — global app providers
- `src/types/` — shared frontend types
- `e2e/` — Playwright smoke tests

---

## Docs Structure

```text
docs/
├─ adr/
├─ architecture/
├─ api/
├─ database/
├─ deployment/
├─ runbooks/
└─ product/
```

### Important docs

- `docs/architecture/system-architecture.md`
- `docs/architecture/erd-and-module-breakdown.md`
- `docs/api/api-contract.md`
- `docs/database/database-schema.md`
- `docs/database/permission-model.md`
- `docs/deployment/deploy-config.md`
- `docs/deployment/deployment-staging.md`
- `docs/deployment/env-checklist.md`
- `docs/runbooks/bunny-webhook-setup.md`
- `docs/runbooks/staging-test-runbook.md`
- `docs/product/implementation-roadmap.md`

---

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL (Neon recommended)

Optional later:
- Redis
- Bunny Stream
- R2/S3

---

## Environment Setup

Copy:

```bash
cp .env.example .env
```

Required minimum values:

```env
DATABASE_URL="postgresql://..."
API_PORT=4000
JWT_ACCESS_SECRET="replace-me"
JWT_REFRESH_SECRET="replace-me-too"
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_WEB_ORIGIN="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="ChangeMe123!"
```

For Bunny foundation:

```env
BUNNY_STREAM_API_KEY="..."
BUNNY_STREAM_READONLY_KEY="..."
BUNNY_STREAM_LIBRARY_ID="..."
BUNNY_STREAM_PULL_ZONE="..."
BUNNY_STREAM_EMBED_HOST="iframe.mediadelivery.net"
BUNNY_STREAM_SIGNING_KEY="..."
ASSET_URL_SECRET="..."
ASSET_ACCESS_BASE_URL="http://localhost:4000"
```

See also:
- `docs/deployment/env-checklist.md`

---

## Install

```bash
npm install
```

---

## Database

### Validate schema

```bash
npx prisma validate
```

### Generate Prisma client

```bash
npx prisma generate
```

### Run migrations

Local dev:

```bash
npx prisma migrate dev --name init
```

Staging/production:

```bash
npx prisma migrate deploy
```

### Seed

```bash
npm run prisma:seed
```

Seed creates:
- roles
- course categories
- admin account if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
- sample course if configured by seed logic

---

## Run Locally

### Backend

```bash
npm run dev:api
```

Backend URL:
- `http://localhost:4000`

Health:
- `http://localhost:4000/api/v1/health`

### Frontend

```bash
npm run dev:web
```

Frontend URL:
- usually `http://localhost:3000`

---

## Build

### Backend

```bash
npm run build:api
```

### Frontend

```bash
npm run build:web
```

Note:
- `build:web` clears `apps/web/.next` first to avoid intermittent Windows cache issues.

---

## Docker Quick Start

This repository now includes Docker packaging so team members can run the project with minimal local setup.

### Requirements
- Docker Desktop
- Docker Compose v2

### Start full stack

```bash
docker compose up --build
```

Or use the helper:

```bash
npm run docker:up
```

Services:
- frontend: `http://localhost:3000`
- backend: `http://localhost:4000`
- postgres: `localhost:5432`
- redis: `localhost:6379`

### What happens automatically
- PostgreSQL container starts
- Redis container starts
- backend runs Prisma migrations
- backend runs seed script
- frontend starts on port 3000

### Default admin in Docker
- email: `admin@example.com`
- password: `ChangeMe123!`

Change these values in `docker-compose.yml` before sharing with team.

### Stop containers

```bash
docker compose down
```

Or:

```bash
npm run docker:down
```

### Reset database volume

```bash
docker compose down -v
```

Or:

```bash
npm run docker:reset
```

### Useful Docker helper commands

```bash
npm run docker:logs
npm run docker:ps
npm run docker:rebuild
npm run docker:config
```

### Notes
- Bunny, email, and object storage envs are placeholder values in Docker by default.
- Core LMS flows still run locally without external Bunny configuration.
- If team needs staging-like video behavior, update Bunny envs in `docker-compose.yml`.

---

## Tests

### Backend tests

```bash
npm --workspace apps/api run test
```

Current coverage includes:
- auth register flow
- duplicate register case
- enrollment access checks
- lesson access rule checks
- comments ownership/access checks
- selected HTTP flow tests

### Frontend E2E

```bash
npm run test:e2e
```

Current Playwright smoke tests cover:
- admin users screen
- student dashboard/course/lesson/comments flow

---

## Main User Flows Implemented

### Admin
- approve / reject users
- grant / pause / activate / revoke enrollments
- create/update/archive courses
- create/update/delete sections
- create/update/delete lessons
- create/update/delete assets
- create Bunny video placeholder
- upload Bunny video through backend
- moderate comments

### Student
- register and login
- pending approval handling
- view dashboard
- view enrolled courses
- open course details
- open lesson details
- update progress
- mark lesson complete
- create/reply/edit/delete own comments

---

## Current Security Model

- JWT access token
- refresh token in HttpOnly cookie
- CSRF protection via double-submit token
- one-active-session policy foundation
- enrollment check before student lesson access
- signed internal asset access URLs
- Bunny playback signing foundation

---

## Deployment

### Frontend
- Vercel

### Backend
- Railway

### Database
- Neon PostgreSQL

### Deployment docs
- `docs/deployment/deploy-config.md`
- `docs/deployment/deployment-staging.md`
- `docs/runbooks/staging-test-runbook.md`

### Bunny webhook setup
- `docs/runbooks/bunny-webhook-setup.md`

---

## VS Code

Included:
- `.vscode/launch.json`
- `.vscode/tasks.json`

You can run:
- API
- Web
- full stack
- migrate / seed / tests

directly from VS Code.

---

## Important Notes

### This repo is production-oriented, but not fully production-complete yet.

Still recommended before real launch:
- finalize Bunny signed playback implementation details
- strengthen CSRF documentation and browser-state tests
- add real signed R2/S3 file URLs
- add queue/job processing where needed
- expand integration and E2E coverage

### Some folders are scaffolding placeholders on purpose.

Examples:
- `integrations/storage/`
- `integrations/email/`
- `shared/policies/`
- `apps/web/src/server/`

These exist so the project can grow cleanly without another structural rewrite.

---

## Suggested Next Steps

1. finalize real staging deployment
2. configure Bunny webhook in staging
3. validate full video upload/playback flow
4. continue feature work inside the new structure

---

## Repository Status

This repo has been refactored toward the target architecture with:
- cleaner monorepo layout
- layered backend structure
- feature-first frontend structure
- docs taxonomy split by concern
- working build + test baseline
