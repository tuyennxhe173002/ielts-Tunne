# Staging Test Runbook

## Objective

Validate the LMS staging environment end-to-end before production rollout.

## Preconditions

- Neon staging DB configured
- backend staging deployed
- frontend staging deployed
- Bunny Stream library configured
- Bunny webhook set to staging API
- admin seed completed

## Environment checklist

Confirm all are set:
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_WEB_ORIGIN`
- `ASSET_URL_SECRET`
- `ASSET_ACCESS_BASE_URL`
- `BUNNY_STREAM_API_KEY`
- `BUNNY_STREAM_READONLY_KEY`
- `BUNNY_STREAM_LIBRARY_ID`

## Test accounts

### Admin
- seeded admin email
- seeded admin password

### Student candidate
- fresh email for signup flow

## Test flow

### 1. Public registration
1. Open staging frontend `/register`
2. Register a new student account
3. Confirm success response

Expected:
- user created with `pending` status

### 2. Admin login
1. Open `/login`
2. Login with seeded admin account
3. Open `/admin/users`

Expected:
- admin session works
- pending user appears in approval queue

### 3. Approval
1. Click `Duyệt`
2. Refresh page

Expected:
- pending list updates
- approved user visible in users list

### 4. Create course content
1. Open `/admin/courses`
2. Create a new test course
3. Open course editor
4. Create section
5. Create lesson
6. Add text asset or external asset

Expected:
- course editor persists changes

### 5. Bunny video flow
1. In lesson editor, click `Create Bunny video`
2. Confirm Bunny asset created
3. Choose a test video file
4. Click `Upload to Bunny`
5. Wait for Bunny webhook callback

Expected:
- asset metadata contains `videoId`
- upload metadata updated
- webhook updates `bunnyStatusLabel`

### 6. Enrollment
1. Open `/admin/users`
2. Select approved student
3. Select course
4. Click `Gán khóa học`

Expected:
- enrollment visible on user row

### 7. Student login
1. Logout admin
2. Login as student
3. Open `/dashboard`
4. Open `/my-courses`

Expected:
- student sees only enrolled course(s)

### 8. Course access
1. Open student course detail
2. Open lesson detail

Expected:
- lesson loads
- study note/asset area loads

### 9. Progress
1. Click `Bắt đầu học`
2. Click `Đánh dấu hoàn thành`
3. Refresh lesson and dashboard

Expected:
- progress persists
- dashboard counts update

### 10. Comments
1. Student posts comment
2. Student replies
3. Login as admin
4. Open `/admin/comments`
5. Hide or delete comment

Expected:
- moderation reflects in lesson page

### 11. Signed asset access
1. Student opens attachment

Expected:
- frontend first requests signed access URL
- backend validates enrollment and redirects

### 12. Playback access
1. Student clicks `Mở video bài học`

Expected:
- backend returns Bunny playback URL or fallback access URL

### 13. Session hardening
1. Login same student in second browser/device
2. Retry protected call from first session

Expected:
- old session eventually fails
- refresh/login required again

## Failure log template

For each failing test record:
- step number
- route or endpoint
- expected result
- actual result
- screenshots or response body
- reproducible yes/no

## Release gate

Do not promote to production if any of these fail:
- auth login/refresh/logout
- approval flow
- enrollments
- lesson access
- Bunny upload/webhook
- progress persistence
- comment moderation
- session invalidation
