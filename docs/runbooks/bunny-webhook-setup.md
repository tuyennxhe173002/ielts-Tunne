# Bunny Webhook Setup

## Goal

Connect Bunny Stream status callbacks to the LMS backend so video encode state updates are stored automatically.

## Endpoint

Current webhook endpoint:

```text
POST /api/v1/webhooks/bunny/stream
```

Example staging URL:

```text
https://staging-api.your-domain.com/api/v1/webhooks/bunny/stream
```

## What the backend expects

Headers:
- `X-BunnyStream-Signature-Version: v1`
- `X-BunnyStream-Signature-Algorithm: hmac-sha256`
- `X-BunnyStream-Signature: <hex signature>`

Body example:
```json
{
  "VideoLibraryId": 133,
  "VideoGuid": "657bb740-a71b-4529-a012-528021c31a92",
  "Status": 3
}
```

## Signature validation rule

Backend validates the exact raw request body using:
- algorithm: HMAC-SHA256
- secret: Bunny library **Read-Only API key**

This is why `BUNNY_STREAM_READONLY_KEY` must be set correctly.

## Bunny status mapping currently supported

- `0` -> `queued`
- `1` -> `processing`
- `2` -> `encoding`
- `3` -> `finished`
- `4` -> `resolution_finished`
- `5` -> `failed`
- `6` -> `presigned_upload_started`
- `7` -> `presigned_upload_finished`
- `8` -> `presigned_upload_failed`
- `9` -> `captions_generated`
- `10` -> `title_or_description_generated`

## What gets updated in DB

For the matching `lesson_asset` with `provider = bunny_stream`, backend updates `metadataJson` fields:
- `videoId`
- `libraryId`
- `bunnyStatus`
- `bunnyStatusLabel`
- `lastWebhookAt`

## Setup steps in Bunny dashboard

1. Open your Bunny Stream library
2. Go to webhook settings for the library
3. Set webhook URL to:
   - `https://staging-api.your-domain.com/api/v1/webhooks/bunny/stream`
4. Save webhook settings

## Required env before testing

```env
BUNNY_STREAM_API_KEY="..."
BUNNY_STREAM_READONLY_KEY="..."
BUNNY_STREAM_LIBRARY_ID="..."
ASSET_ACCESS_BASE_URL="https://staging-api.your-domain.com"
```

## End-to-end test flow

1. Admin opens course editor
2. Admin creates lesson
3. Admin clicks `Create Bunny video`
4. System stores Bunny `videoId` and `uploadUrl`
5. Admin uploads real video file using `Upload to Bunny`
6. Bunny processes video
7. Bunny sends webhook to staging API
8. Backend updates `metadataJson.bunnyStatusLabel`
9. Student opens lesson and requests playback URL

## Quick verification steps

### After create Bunny video
Check asset metadata contains:
- `videoId`
- `libraryId`
- `uploadUrl`

### After upload
Check asset metadata contains:
- `uploadStatus: uploaded`
- `uploadedAt`

### After webhook
Check asset metadata contains:
- `bunnyStatus`
- `bunnyStatusLabel`
- `lastWebhookAt`

## Common failure cases

### 1. Webhook returns 401
Cause:
- wrong `BUNNY_STREAM_READONLY_KEY`
- request body signature mismatch

### 2. Webhook returns success but asset not updated
Cause:
- `VideoGuid` not matching any stored Bunny asset metadata

### 3. Admin can create Bunny video but upload fails
Cause:
- wrong `BUNNY_STREAM_API_KEY`
- wrong library ID
- file too large/network issue

### 4. Student cannot open playback
Cause:
- lesson not published
- no enrollment
- Bunny asset metadata missing `videoId`

## Important notes

- Read-only key must never be exposed to frontend.
- API key must never be exposed to frontend.
- Current implementation is foundation-level, not final signed playback.
- Next step after webhook setup should be real signed Bunny playback token generation.
