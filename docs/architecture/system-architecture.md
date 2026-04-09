# System Architecture

## Overview

This platform is a public LMS for:
- IELTS
- TOEIC
- Japanese
- Korean

Core goals:
- public course platform
- student registration and login
- manual admin approval
- per-course enrollment
- secure-ish video delivery
- downloadable lesson files
- study notes
- lesson comments and replies
- online progress tracking
- one active session per account
- modern admin CMS

## Architecture Style

The system uses a separated web app + backend API architecture:

```text
[ Browser ]
    |
    v
[ Next.js Frontend ]
    |
    v
[ NestJS API ]
   |      |       |          |
   v      v       v          v
[Postgres][Redis][Object Storage][Bunny Stream]
```

## Frontend

### Stack
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Areas
- Public marketing site
- Student learning app
- Admin CMS

### Public pages
- Landing page
- Course catalog
- Course detail page
- Login/Register

### Student pages
- Dashboard
- My courses
- Course overview
- Lesson page
- Progress view

### Admin pages
- User approvals
- User management
- Course management
- Section and lesson management
- Asset management
- Comment moderation
- Enrollment management

## Backend

### Stack
- NestJS
- TypeScript
- REST API

### Core modules
- AuthModule
- UsersModule
- ApprovalsModule
- RolesModule
- SessionsModule
- DevicesModule
- CoursesModule
- SectionsModule
- LessonsModule
- AssetsModule
- EnrollmentsModule
- ProgressModule
- CommentsModule
- NotificationsModule
- AuditLogsModule

### Responsibilities
- authentication
- authorization
- approval workflow
- enrollment control
- session and device policy
- signed access to lesson files and video playback
- progress tracking
- comment moderation
- audit logging

## Database

### Stack
- PostgreSQL
- Prisma ORM

### Why PostgreSQL
The domain is relational:
- users to enrollments to courses
- courses to sections to lessons
- lessons to assets and comments
- users to sessions and devices
- users to lesson progress

## Cache and Jobs

### Stack
- Redis
- BullMQ

### Use cases
- session cache
- rate limiting
- one-active-session support
- background jobs
- email jobs
- notification jobs
- webhook handling for video processing

## File Storage

### Stack
- Cloudflare R2 or AWS S3

### Stored content
- PDF
- DOCX
- slides
- worksheets
- images
- lesson attachments

### Important
Video files should not be served directly from object storage for premium lesson playback.

## Video Delivery

### Stack
- Bunny Stream

### Responsibilities
- video upload pipeline
- video encoding
- tokenized playback
- secure-ish streaming delivery

### Important
The system should never expose raw unrestricted video URLs.

## Authentication

### Login methods
- Google OAuth
- email/password

### Approval model
- every new account starts as pending
- admin manually approves or rejects
- only approved users can access enrolled courses

## Session Policy

### Rule
One account has one active session at a time.

### Behavior
- login on new device/browser creates a new session
- previous active session is revoked
- revoked session is forced to logout

### Notes
This is risk reduction, not absolute anti-sharing enforcement.

## Device Model

The backend stores:
- fingerprint hash
- user agent
- IP address
- first seen
- last seen
- revoke status

This is used for tracking and session control, not for claiming perfect device uniqueness.

## Course Model

### Hierarchy
```text
Course
  -> Section
    -> Lesson
      -> Assets
      -> Comments
      -> Progress
```

### Lesson content
A lesson may contain:
- title
- summary
- study note
- video
- downloadable files
- optional links
- comment thread

## Comment System

### Scope
Comments are scoped to lessons.

### Features
- comment
- reply
- admin moderation

### Non-goals for v1
- forum
- direct messages
- social feed
- reactions

## Security Model

### Access control rules
- public users can only access public pages
- pending users cannot access learning content
- students can access only enrolled courses
- admins manage content and users
- lesson assets require backend permission checks

### Content protection
- signed file URLs
- tokenized video playback
- optional watermark overlay per user
- no public direct file/video links

### Audit
All sensitive actions must be logged:
- approvals
- enrollments
- session revocations
- content updates
- comment moderation

## Deployment

### Frontend
- Vercel

### Backend
- Railway or Render

### Database
- managed PostgreSQL

### Redis
- Upstash Redis or Railway Redis

### Video
- Bunny Stream

### Storage
- R2 or S3

## Environment Strategy

Required environments:
- local
- staging
- production

## Observability

### Error tracking
- Sentry frontend
- Sentry backend

### Product analytics
- PostHog

### Suggested tracked events
- signup created
- approval granted
- login success
- course opened
- lesson started
- lesson completed
- comment created
- session revoked

## MVP Boundary

### Included in v1
- public site
- auth
- manual approval
- enrollments
- course/section/lesson structure
- video lessons
- lesson files
- study notes
- comments
- online progress
- one active session

### Excluded from v1
- payment
- certificates
- quizzes
- teacher roles
- livestreams
- mobile apps
- advanced anti-piracy
