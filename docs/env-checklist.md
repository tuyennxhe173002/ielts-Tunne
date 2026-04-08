# Environment Checklist

## Overview

This checklist covers the minimum environment variables needed to run staging safely.

## Shared

### DATABASE_URL
PostgreSQL connection string for Neon staging DB.

Example:
```env
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
```

## API env

### API_PORT
Default:
```env
API_PORT=4000
```

### JWT_ACCESS_SECRET
Use a long random secret.

### JWT_REFRESH_SECRET
Use a different long random secret.

### REDIS_URL
Optional for now, required later for queues/session cache hardening.

Example:
```env
REDIS_URL="redis://localhost:6379"
```

## Web env

### NEXT_PUBLIC_API_BASE_URL
Must point to deployed staging API.

Example:
```env
NEXT_PUBLIC_API_BASE_URL="https://staging-api.your-domain.com/api/v1"
```

### NEXT_PUBLIC_WEB_ORIGIN
Must match deployed frontend origin.

Example:
```env
NEXT_PUBLIC_WEB_ORIGIN="https://staging-web.your-domain.com"
```

## Bunny Stream env

### BUNNY_STREAM_API_KEY
Used by backend to create videos and upload video binaries.

### BUNNY_STREAM_READONLY_KEY
Used to verify Bunny webhook signatures.

### BUNNY_STREAM_LIBRARY_ID
Your Bunny video library ID.

### BUNNY_STREAM_PULL_ZONE
Optional for future direct playback domain use.

### BUNNY_STREAM_EMBED_HOST
Default:
```env
BUNNY_STREAM_EMBED_HOST="iframe.mediadelivery.net"
```

### BUNNY_STREAM_SIGNING_KEY
Reserved for the next step: real signed Bunny playback URLs.

## Asset security env

### ASSET_URL_SECRET
Used to sign internal short-lived asset access tokens.

### ASSET_ACCESS_BASE_URL
Must point to backend public base URL.

Example:
```env
ASSET_ACCESS_BASE_URL="https://staging-api.your-domain.com"
```

### ASSET_PUBLIC_BASE_URL
Leave blank if not using direct public file storage URLs.

## Storage env

### R2_ACCOUNT_ID
### R2_ACCESS_KEY_ID
### R2_SECRET_ACCESS_KEY

Not fully used yet in runtime, but keep ready for upcoming signed file delivery.

## Email env

### RESEND_API_KEY
Needed later for approval emails, comment reply notifications, password reset.

## Seed bootstrap env

### ADMIN_EMAIL
The first admin created by seed.

### ADMIN_PASSWORD
Temporary admin password for staging.

## Minimum working staging set

```env
DATABASE_URL="..."
API_PORT=4000
JWT_ACCESS_SECRET="..."
JWT_REFRESH_SECRET="..."
NEXT_PUBLIC_API_BASE_URL="https://staging-api.your-domain.com/api/v1"
NEXT_PUBLIC_WEB_ORIGIN="https://staging-web.your-domain.com"
BUNNY_STREAM_API_KEY="..."
BUNNY_STREAM_READONLY_KEY="..."
BUNNY_STREAM_LIBRARY_ID="..."
BUNNY_STREAM_EMBED_HOST="iframe.mediadelivery.net"
ASSET_URL_SECRET="..."
ASSET_ACCESS_BASE_URL="https://staging-api.your-domain.com"
ADMIN_EMAIL="your-admin@example.com"
ADMIN_PASSWORD="StrongTempPassword123!"
```

## Validation checklist

- `DATABASE_URL` points to staging, not production
- frontend origin and backend CORS origin match exactly
- Bunny read-only key is not exposed to frontend
- Bunny API key exists only on backend
- secrets are different between staging and production
- temp admin password changed after first login later
