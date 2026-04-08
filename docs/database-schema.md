# Database Schema

## Overview

This schema supports:
- public registration
- admin approval
- student/admin roles
- course enrollments
- lessons, files, video metadata
- lesson comments
- per-user lesson progress
- one-active-session policy
- audit history

## Conventions
- database: PostgreSQL
- ORM: Prisma
- primary keys: UUID
- timestamps: `created_at`, `updated_at`
- soft delete when needed: `deleted_at`
- status fields use constrained string values

## Tables

## roles
- `id` UUID PK
- `code` VARCHAR(50) UNIQUE NOT NULL
- `name` VARCHAR(100) NOT NULL
- `description` TEXT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Seed data:
- `admin`
- `student`

## users
- `id` UUID PK
- `email` VARCHAR(255) UNIQUE NOT NULL
- `email_verified_at` TIMESTAMPTZ NULL
- `status` VARCHAR(30) NOT NULL DEFAULT `pending`
- `primary_role_id` UUID NOT NULL FK -> `roles.id`
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `last_login_at` TIMESTAMPTZ NULL
- `deleted_at` TIMESTAMPTZ NULL

Allowed status values:
- `pending`
- `approved`
- `rejected`
- `suspended`

Indexes:
- unique `email`
- index `status`
- index `primary_role_id`

## user_profiles
- `user_id` UUID PK FK -> `users.id`
- `full_name` VARCHAR(150) NOT NULL
- `avatar_url` TEXT NULL
- `phone` VARCHAR(30) NULL
- `bio` TEXT NULL
- `preferred_language` VARCHAR(10) NULL DEFAULT `vi`
- `timezone` VARCHAR(50) NULL DEFAULT `Asia/Ho_Chi_Minh`
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

## user_credentials
- `id` UUID PK
- `user_id` UUID NOT NULL FK -> `users.id`
- `provider` VARCHAR(30) NOT NULL
- `provider_user_id` VARCHAR(255) NULL
- `password_hash` TEXT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Allowed provider values:
- `google`
- `password`

Constraints:
- unique (`provider`, `provider_user_id`)

## admin_approvals
- `id` UUID PK
- `user_id` UUID NOT NULL FK -> `users.id`
- `decision` VARCHAR(20) NOT NULL
- `note` TEXT NULL
- `decided_by_user_id` UUID NOT NULL FK -> `users.id`
- `decided_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Decision values:
- `approved`
- `rejected`

## user_devices
- `id` UUID PK
- `user_id` UUID NOT NULL FK -> `users.id`
- `fingerprint_hash` VARCHAR(255) NOT NULL
- `device_name` VARCHAR(255) NULL
- `user_agent` TEXT NULL
- `ip_address` INET NULL
- `first_seen_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `last_seen_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `revoked_at` TIMESTAMPTZ NULL

Constraint:
- unique (`user_id`, `fingerprint_hash`)

## user_sessions
- `id` UUID PK
- `user_id` UUID NOT NULL FK -> `users.id`
- `device_id` UUID NULL FK -> `user_devices.id`
- `refresh_token_hash` TEXT NOT NULL
- `access_token_version` INTEGER NOT NULL DEFAULT 1
- `status` VARCHAR(20) NOT NULL DEFAULT `active`
- `issued_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `expires_at` TIMESTAMPTZ NOT NULL
- `revoked_at` TIMESTAMPTZ NULL
- `revoked_reason` VARCHAR(100) NULL
- `last_activity_at` TIMESTAMPTZ NULL

Status values:
- `active`
- `revoked`
- `expired`

Indexes:
- index `user_id`
- index `status`
- index (`user_id`, `status`)

## course_categories
- `id` UUID PK
- `slug` VARCHAR(100) UNIQUE NOT NULL
- `name` VARCHAR(100) NOT NULL
- `description` TEXT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Seed data:
- `ielts`
- `toeic`
- `japanese`
- `korean`

## courses
- `id` UUID PK
- `category_id` UUID NOT NULL FK -> `course_categories.id`
- `slug` VARCHAR(150) UNIQUE NOT NULL
- `title` VARCHAR(255) NOT NULL
- `short_description` TEXT NULL
- `long_description` TEXT NULL
- `thumbnail_url` TEXT NULL
- `intro_video_url` TEXT NULL
- `status` VARCHAR(20) NOT NULL DEFAULT `draft`
- `visibility` VARCHAR(20) NOT NULL DEFAULT `public`
- `created_by_user_id` UUID NOT NULL FK -> `users.id`
- `updated_by_user_id` UUID NULL FK -> `users.id`
- `published_at` TIMESTAMPTZ NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Status values:
- `draft`
- `published`
- `archived`

Visibility values:
- `public`
- `private`

## course_sections
- `id` UUID PK
- `course_id` UUID NOT NULL FK -> `courses.id`
- `title` VARCHAR(255) NOT NULL
- `description` TEXT NULL
- `position` INTEGER NOT NULL
- `status` VARCHAR(20) NOT NULL DEFAULT `draft`
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Constraint:
- unique (`course_id`, `position`)

## lessons
- `id` UUID PK
- `course_id` UUID NOT NULL FK -> `courses.id`
- `section_id` UUID NOT NULL FK -> `course_sections.id`
- `slug` VARCHAR(150) NOT NULL
- `title` VARCHAR(255) NOT NULL
- `summary` TEXT NULL
- `study_note` TEXT NULL
- `content_html` TEXT NULL
- `lesson_type` VARCHAR(30) NOT NULL DEFAULT `video`
- `status` VARCHAR(20) NOT NULL DEFAULT `draft`
- `position` INTEGER NOT NULL
- `duration_seconds` INTEGER NULL
- `is_preview` BOOLEAN NOT NULL DEFAULT FALSE
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Lesson type values:
- `video`
- `document`
- `mixed`
- `quiz` future

Constraints:
- unique (`section_id`, `slug`)
- unique (`section_id`, `position`)

Indexes:
- index `course_id`
- index `section_id`
- index `status`

## lesson_assets
- `id` UUID PK
- `lesson_id` UUID NOT NULL FK -> `lessons.id`
- `asset_type` VARCHAR(30) NOT NULL
- `provider` VARCHAR(30) NOT NULL
- `storage_key` TEXT NULL
- `external_url` TEXT NULL
- `display_name` VARCHAR(255) NOT NULL
- `mime_type` VARCHAR(100) NULL
- `size_bytes` BIGINT NULL
- `metadata_json` JSONB NULL
- `position` INTEGER NOT NULL DEFAULT 1
- `is_downloadable` BOOLEAN NOT NULL DEFAULT FALSE
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Asset type values:
- `video`
- `pdf`
- `doc`
- `slide`
- `audio`
- `image`
- `link`

Provider values:
- `bunny_stream`
- `r2`
- `s3`
- `external`

## enrollments
- `id` UUID PK
- `user_id` UUID NOT NULL FK -> `users.id`
- `course_id` UUID NOT NULL FK -> `courses.id`
- `status` VARCHAR(20) NOT NULL DEFAULT `active`
- `granted_by_user_id` UUID NOT NULL FK -> `users.id`
- `granted_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `expires_at` TIMESTAMPTZ NULL
- `revoked_at` TIMESTAMPTZ NULL
- `revoked_by_user_id` UUID NULL FK -> `users.id`
- `revoke_reason` TEXT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Status values:
- `active`
- `paused`
- `revoked`
- `expired`

Constraint:
- unique (`user_id`, `course_id`)

Indexes:
- index `status`
- index `course_id`

## lesson_progress
- `id` UUID PK
- `user_id` UUID NOT NULL FK -> `users.id`
- `lesson_id` UUID NOT NULL FK -> `lessons.id`
- `status` VARCHAR(20) NOT NULL DEFAULT `not_started`
- `progress_percent` NUMERIC(5,2) NOT NULL DEFAULT 0
- `last_position_seconds` INTEGER NULL
- `first_opened_at` TIMESTAMPTZ NULL
- `last_opened_at` TIMESTAMPTZ NULL
- `completed_at` TIMESTAMPTZ NULL
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Status values:
- `not_started`
- `in_progress`
- `completed`

Constraint:
- unique (`user_id`, `lesson_id`)

Indexes:
- unique (`user_id`, `lesson_id`)
- index `user_id`
- index `lesson_id`
- index (`user_id`, `status`)

## lesson_comments
- `id` UUID PK
- `lesson_id` UUID NOT NULL FK -> `lessons.id`
- `user_id` UUID NOT NULL FK -> `users.id`
- `parent_id` UUID NULL FK -> `lesson_comments.id`
- `body` TEXT NOT NULL
- `status` VARCHAR(20) NOT NULL DEFAULT `visible`
- `edited_at` TIMESTAMPTZ NULL
- `deleted_at` TIMESTAMPTZ NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Status values:
- `visible`
- `hidden`
- `deleted`

Indexes:
- index `lesson_id`
- index `parent_id`
- index `status`
- index `created_at`

## notifications
- `id` UUID PK
- `user_id` UUID NOT NULL FK -> `users.id`
- `type` VARCHAR(50) NOT NULL
- `title` VARCHAR(255) NOT NULL
- `body` TEXT NULL
- `payload_json` JSONB NULL
- `read_at` TIMESTAMPTZ NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Example types:
- `approval_granted`
- `approval_rejected`
- `comment_reply`
- `course_assigned`

## audit_logs
- `id` UUID PK
- `actor_user_id` UUID NULL FK -> `users.id`
- `action_type` VARCHAR(100) NOT NULL
- `entity_type` VARCHAR(50) NOT NULL
- `entity_id` UUID NULL
- `ip_address` INET NULL
- `user_agent` TEXT NULL
- `payload_json` JSONB NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

Examples:
- `user.approved`
- `course.created`
- `lesson.updated`
- `enrollment.granted`
- `session.revoked`
- `comment.hidden`

Indexes:
- index `actor_user_id`
- index (`entity_type`, `entity_id`)
- index `created_at`

## Main relationships

- `users 1-1 user_profiles`
- `users 1-n user_credentials`
- `users 1-n user_devices`
- `users 1-n user_sessions`
- `users 1-n enrollments`
- `users 1-n lesson_progress`
- `users 1-n lesson_comments`
- `course_categories 1-n courses`
- `courses 1-n course_sections`
- `course_sections 1-n lessons`
- `lessons 1-n lesson_assets`
- `lessons 1-n lesson_comments`
- `users n-n courses` through `enrollments`

## MVP core subset

Required in v1:
- `roles`
- `users`
- `user_profiles`
- `user_credentials`
- `admin_approvals`
- `user_sessions`
- `courses`
- `course_sections`
- `lessons`
- `lesson_assets`
- `enrollments`
- `lesson_progress`
- `lesson_comments`
- `audit_logs`

Recommended also in v1:
- `user_devices`
- `notifications`
