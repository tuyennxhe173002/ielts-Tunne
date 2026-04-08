# Deploy Config

## Monorepo deployment strategy

This repository deploys as two separate services:

- frontend: `apps/web` on Vercel
- backend: `apps/api` on Railway

## Vercel frontend

### Root directory
Set project root directory in Vercel dashboard to:

```text
apps/web
```

### Config file
Committed file:

```text
apps/web/vercel.json
```

### Required Vercel env
- `NEXT_PUBLIC_API_BASE_URL`

Optional but recommended:
- `NEXT_PUBLIC_WEB_ORIGIN`

### Build expectations
- install command: `npm install`
- build command: `npm run build`

## Railway backend

### Root directory
Set service root to repository root or point Railway to the repo and use committed config.

### Config files
- `apps/api/railway.json`
- `apps/api/Dockerfile`

### Health endpoint

```text
/api/v1/health
```

### Required Railway env
- `DATABASE_URL`
- `API_PORT`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `NEXT_PUBLIC_WEB_ORIGIN`
- `ASSET_URL_SECRET`
- `ASSET_ACCESS_BASE_URL`
- `BUNNY_STREAM_API_KEY`
- `BUNNY_STREAM_READONLY_KEY`
- `BUNNY_STREAM_LIBRARY_ID`

## Post-deploy commands

Run after backend env is set:

```bash
npx prisma migrate deploy
npm run prisma:seed
```

## Deployment notes

- backend must be deployed before frontend final verification
- Bunny webhook should point to backend staging URL first
- never use production Neon DB for staging deploy tests
