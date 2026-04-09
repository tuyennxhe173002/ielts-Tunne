# Deployment Staging

## Goal

Bring the LMS up in a safe staging environment before production.

## Recommended staging topology

- Frontend: Vercel
- Backend API: Railway or Render
- Database: Neon PostgreSQL
- Video: Bunny Stream
- Files: R2 or S3 later

## Current app layout

- frontend app: `apps/web`
- backend app: `apps/api`
- database schema: `prisma/schema.prisma`

## Staging domains

Recommended:
- web: `https://staging-web.your-domain.com`
- api: `https://staging-api.your-domain.com`

Or simplest temporary setup:
- web: Vercel preview/staging URL
- api: Railway/Render generated URL

## Deploy order

1. Neon database ready
2. backend API deploy
3. run Prisma migrations on staging DB
4. seed admin and categories
5. frontend deploy with staging API URL
6. Bunny webhook points to staging API
7. end-to-end staging test

## Backend staging deployment

### Required runtime
- Node.js 20+

### Start command
```bash
npm install
npm run build:api
npm --workspace apps/api run start:dev
```

For real staging deployment, prefer a production start command later, but current scaffold is enough to validate architecture.

## Frontend staging deployment

### Vercel root directory
- project root

### Build command
```bash
npm run build:web
```

### Output
Handled by Next.js automatically.

## Database migration flow

Use staging `DATABASE_URL`.

### Apply migrations
```bash
npx prisma migrate deploy
```

### Generate Prisma client
```bash
npx prisma generate
```

### Seed staging admin and sample data
```bash
npm run prisma:seed
```

## Smoke test checklist

### Auth
- register new account
- login existing admin
- refresh token rotation works
- logout clears session

### Approval
- pending user appears in admin queue
- approve user works
- rejected user cannot access student area

### Enrollments
- admin grants course
- student sees course in `/my-courses`

### Course CMS
- admin creates course
- admin creates section
- admin creates lesson
- admin creates asset

### Student learning
- student opens course
- student opens lesson
- progress updates
- comments create/reply

### Bunny
- admin creates Bunny video placeholder
- admin uploads video
- webhook updates status
- student opens playback URL

## Staging release gate

Do not mark staging ready unless all are true:
- backend build passes
- frontend build passes
- Prisma validate passes
- migration deploy passes
- seed passes
- webhook test passes
- lesson playback test passes

## Known staging limitations right now

- access token still stored in sessionStorage
- no full CSRF strategy yet
- Bunny signed playback is still foundation-level
- no upload progress UX
- no R2/S3 signed URL integration yet

## Recommended next production hardening after staging

1. proper production API start command
2. CSRF protection for cookie-based auth
3. Bunny signed playback implementation using signing key
4. upload status polling/webhook UI sync
5. file storage signed URLs via SDK
