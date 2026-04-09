# Implementation Roadmap

## Overview

This roadmap turns the approved LMS architecture into an implementation sequence that is realistic for a strong first version.

Primary product goals:
- public course platform
- manual admin approval
- per-course enrollment
- secure-ish video lessons
- files and study notes
- comments and replies
- online progress tracking
- one active session policy

## Delivery principles

- build backend domain and permissions before UI polish
- avoid payment, quizzes, certificates in MVP
- use managed video delivery from day 1
- do not keep extending the timetable prototype

## Phase 0 ΓÇö Workspace setup

### Goals
- create monorepo structure
- establish backend and frontend apps
- configure shared environment contract
- add Prisma schema and initial code standards

### Deliverables
- `apps/api`
- `apps/web`
- root `package.json` with workspaces
- root `prisma/schema.prisma`
- root scripts for dev/build/lint

## Phase 1 ΓÇö Database and auth foundation

### Goals
- implement Prisma models and migrations
- bootstrap NestJS auth flow
- create session and approval model

### Backend scope
- `roles`
- `users`
- `user_profiles`
- `user_credentials`
- `admin_approvals`
- `user_devices`
- `user_sessions`

### Deliverables
- Prisma migration draft
- auth DTOs and guards
- JWT + refresh token strategy
- one-active-session logic skeleton

## Phase 2 ΓÇö Public platform and registration

### Goals
- launch branded public site
- support registration and login
- pending approval UX

### Frontend scope
- landing page
- course catalog
- login/register pages
- pending approval page

### Backend scope
- public course listing endpoints
- registration endpoint
- login endpoint
- auth me endpoint

## Phase 3 ΓÇö Admin approvals and enrollments

### Goals
- make operations usable without developer help

### Admin features
- list pending users
- approve/reject
- assign/revoke enrollments
- revoke sessions

### Deliverables
- admin dashboard shell
- user approval table
- enrollment management screens
- audit logging for admin decisions

## Phase 4 ΓÇö Course CMS core

### Goals
- create the content model and authoring flow

### Scope
- course CRUD
- section CRUD
- lesson CRUD
- lesson ordering
- asset metadata management

### Deliverables
- admin course editor
- section/lesson editor
- asset attachment endpoints
- course publish/draft workflow

## Phase 5 ΓÇö Student learning experience

### Goals
- make the enrolled course flow feel complete

### Scope
- student dashboard
- my courses
- course detail page
- lesson page
- continue learning

### Deliverables
- lesson rendering
- note and file panels
- progress status markers
- course completion summaries

## Phase 6 ΓÇö Video and file access

### Goals
- deliver lesson media securely enough for MVP

### Scope
- Bunny Stream token integration
- signed file URLs
- backend permission checks for all lesson assets

### Deliverables
- playback token endpoint
- upload flow contract
- attachment download URL endpoint

## Phase 7 ΓÇö Comments and moderation

### Goals
- support lesson-level Q&A

### Scope
- comment create/list
- reply
- admin hide/delete
- optional own-edit window

### Deliverables
- lesson discussion UI
- admin moderation queue
- notification triggers for replies

## Phase 8 ΓÇö Progress and session hardening

### Goals
- make learning state reliable across devices while limiting account sharing

### Scope
- lesson progress read/write
- continue learning based on last progress
- session revoke on new login
- active session checks on protected routes

### Deliverables
- progress endpoints
- dashboard progress cards
- forced logout behavior for revoked session

## Phase 9 ΓÇö QA and launch prep

### Goals
- remove obvious launch blockers

### Scope
- auth QA
- enrollment QA
- lesson access QA
- comment moderation QA
- asset access QA
- staging deploy

### Deliverables
- launch checklist
- environment documentation
- seed plan
- support playbook

## MVP Definition

The MVP is complete when:
- users can register and login
- admins can approve users and assign courses
- admins can create courses, sections, lessons, and assets
- students can view enrolled courses only
- students can watch videos, read notes, open files, and comment
- progress is stored online
- new login invalidates old session

## Not in MVP

- payment
- coupons
- certificates
- quizzes
- teacher role
- live classes
- mobile app
- advanced anti-piracy analytics

## Suggested build order

1. monorepo scaffold
2. prisma + auth skeleton
3. approval + enrollment backend
4. public and auth frontend
5. admin CMS
6. student dashboard and lessons
7. video/files access
8. comments
9. hardening and QA

## Main risks

- overbuilding before first learners
- building UI before permission model stabilizes
- storing video wrong
- weak admin moderation tools

## Success metrics for first release

- registration to approval flow completes without manual technical intervention
- admin can create course content without code edits
- students can resume lessons from another login after re-authentication
- comments are usable and moderateable
- unauthorized course access is blocked reliably
