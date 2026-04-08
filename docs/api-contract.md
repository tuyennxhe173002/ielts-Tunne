# API Contract

## Overview

This API is a REST contract for a public LMS with:
- public registration
- manual admin approval
- student learning area
- admin CMS
- lesson comments
- online progress
- one active session policy

Status:
- This document is the **target contract**.
- The current scaffold does not implement the full contract yet.
- Sensitive scaffold endpoints should remain disabled or guarded until real auth/session logic is wired.

Base path:
- `/api/v1`

Response convention:
- success: `{ data, meta? }`
- error: `{ error: { code, message, details? } }`

Authentication:
- access token in `Authorization: Bearer <token>`
- refresh flow handled separately

## Auth

### POST `/auth/register`
Create pending user account.

Request:
```json
{
  "email": "student@example.com",
  "password": "StrongPass123!",
  "fullName": "Nguyen Van A"
}
```

Response:
```json
{
  "data": {
    "userId": "uuid",
    "status": "pending"
  }
}
```

### POST `/auth/login`
Login with email/password. New login revokes old active session.

Request:
```json
{
  "email": "student@example.com",
  "password": "StrongPass123!",
  "deviceFingerprint": "hash",
  "deviceName": "Chrome on Windows"
}
```

Response:
```json
{
  "data": {
    "accessToken": "jwt",
    "refreshToken": "token",
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "fullName": "Nguyen Van A",
      "role": "student",
      "status": "approved"
    }
  }
}
```

### POST `/auth/google`
Exchange Google identity token / OAuth code for platform session.

### POST `/auth/refresh`
Rotate refresh token and issue new access token.

### POST `/auth/logout`
Revoke current active session.

### GET `/auth/me`
Get current user profile, role, approval state, current session metadata.

## Public courses

### GET `/courses`
List public published courses.

Query:
- `category`
- `search`
- `page`
- `limit`

### GET `/courses/:slug`
Get public course detail page content.

Response includes:
- title
- descriptions
- thumbnail
- public metadata
- preview lessons only

## Student dashboard and enrollments

### GET `/dashboard`
Return student dashboard summary.

Response includes:
- profile summary
- enrolled courses
- continue learning lesson
- total completion stats

### GET `/me/courses`
List courses user is actively enrolled in.

### GET `/me/courses/:courseSlug`
Get course outline for current student.

Checks:
- approved user
- active enrollment

Returns:
- course
- sections
- lessons
- per-lesson progress snapshot

## Lesson delivery

### GET `/lessons/:lessonId`
Get lesson content for current enrolled student.

Returns:
- lesson metadata
- summary
- study note
- attachments metadata
- progress snapshot

### POST `/lessons/:lessonId/playback-token`
Issue video playback token / signed playback access.

Checks:
- active session
- approved
- enrolled in parent course
- lesson published

Response:
```json
{
  "data": {
    "provider": "bunny_stream",
    "playbackUrl": "https://...",
    "expiresAt": "2026-04-09T10:00:00.000Z"
  }
}
```

### POST `/lessons/:lessonId/assets/:assetId/download-url`
Issue signed file URL.

## Progress

### GET `/me/progress`
List course-level progress summary.

### GET `/me/progress/lessons/:lessonId`
Read own lesson progress.

### PUT `/me/progress/lessons/:lessonId`
Update own lesson progress.

Request:
```json
{
  "status": "in_progress",
  "progressPercent": 45,
  "lastPositionSeconds": 620
}
```

### POST `/me/progress/lessons/:lessonId/complete`
Mark lesson complete.

## Comments

### GET `/lessons/:lessonId/comments`
List visible comments and replies for lesson.

### POST `/lessons/:lessonId/comments`
Create root comment.

Request:
```json
{
  "body": "Em chưa hiểu phần này, thầy giải thích thêm giúp em ạ"
}
```

### POST `/lessons/:lessonId/comments/:commentId/replies`
Reply to an existing comment.

### PATCH `/comments/:commentId`
Edit own comment if allowed by policy.

### DELETE `/comments/:commentId`
Delete own comment if allowed by policy.

## Admin users and approvals

### GET `/admin/users`
List users with filters.

Filters:
- `status`
- `role`
- `search`

### GET `/admin/users/pending`
List pending approval queue.

### POST `/admin/users/:userId/approve`
Approve user.

Request:
```json
{
  "note": "Approved by admin"
}
```

### POST `/admin/users/:userId/reject`
Reject user.

### POST `/admin/users/:userId/revoke-sessions`
Revoke all active sessions for a user.

## Admin enrollments

### GET `/admin/enrollments`
List enrollments.

### POST `/admin/enrollments`
Grant course access.

Request:
```json
{
  "userId": "uuid",
  "courseId": "uuid",
  "expiresAt": null
}
```

### PATCH `/admin/enrollments/:enrollmentId`
Pause, revoke, or extend enrollment.

## Admin courses

### GET `/admin/courses`
List all courses including drafts.

### POST `/admin/courses`
Create course.

### GET `/admin/courses/:courseId`
Read full course detail.

### PATCH `/admin/courses/:courseId`
Update course metadata.

### POST `/admin/courses/:courseId/publish`
Publish course.

### POST `/admin/courses/:courseId/archive`
Archive course.

## Admin sections

### POST `/admin/courses/:courseId/sections`
Create section.

### PATCH `/admin/sections/:sectionId`
Update section.

### POST `/admin/sections/reorder`
Reorder sections.

## Admin lessons

### POST `/admin/sections/:sectionId/lessons`
Create lesson.

### GET `/admin/lessons/:lessonId`
Get full lesson detail.

### PATCH `/admin/lessons/:lessonId`
Update lesson content.

### POST `/admin/lessons/reorder`
Reorder lessons in a section.

## Admin assets

### POST `/admin/lessons/:lessonId/assets`
Attach asset metadata.

### PATCH `/admin/assets/:assetId`
Update asset metadata.

### DELETE `/admin/assets/:assetId`
Detach asset.

### POST `/admin/video/upload-session`
Create provider-specific upload session for Bunny Stream.

## Admin comments moderation

### GET `/admin/comments`
List comments with moderation filters.

### POST `/admin/comments/:commentId/hide`
Hide comment.

### POST `/admin/comments/:commentId/delete`
Delete comment.

## Session and device control

### GET `/me/sessions`
Optional later. List own recent sessions.

### GET `/admin/users/:userId/sessions`
Admin session inspection.

## Standard error codes

- `AUTH_REQUIRED`
- `SESSION_REVOKED`
- `USER_PENDING_APPROVAL`
- `USER_REJECTED`
- `FORBIDDEN`
- `NOT_ENROLLED`
- `LESSON_NOT_PUBLISHED`
- `VALIDATION_ERROR`
- `RESOURCE_NOT_FOUND`
- `COMMENT_EDIT_WINDOW_EXPIRED`

## Notes

- All protected learning routes must verify active session, approval state, and enrollment.
- Admin routes must require admin role.
- Asset/video access must always be tokenized, never public raw links.
