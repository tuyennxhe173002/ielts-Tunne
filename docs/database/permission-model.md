# Permission Model

## Overview

The permission model is role-based with business-state constraints.

The system does not rely only on role.
It also checks:
- approval status
- enrollment status
- lesson publication state
- active session state
- ownership

## Roles

### Guest
- unauthenticated visitor

### Pending User
- authenticated but not approved

### Student
- approved authenticated user with one or more course enrollments

### Admin
- approved authenticated user with platform management rights

## Access Matrix

| Resource | Guest | Pending User | Student | Admin |
|---|---|---|---|---|
| Landing/Catalog | Read | Read | Read | Read |
| Register/Login | Yes | Yes | Yes | Yes |
| Own profile | No | Read/Update own | Read/Update own | Read/Update own |
| Access courses | No | No | Enrolled only | All |
| Access lessons | No | No | Enrolled only | All |
| Lesson progress | No | No | Own only | View all |
| Comments | No | No | Create own / reply / edit own limited | Full moderate |
| Course CRUD | No | No | No | Yes |
| Enrollment manage | No | No | No | Yes |
| Approval manage | No | No | No | Yes |
| Session revoke | No | No | Own logout only | Full |
| Audit logs | No | No | No | Yes |

## Identity checks

Every protected request must validate:
- user is authenticated
- session is active
- token is valid
- user status is approved when learning access is required

## Business-state checks

### Approved access
If `users.status != approved`, user cannot access:
- dashboard
- my courses
- lessons
- progress
- comments
- files
- videos

Pending users may only see a pending-approval screen and their own profile.

## Enrollment rule

Students can access a course only when:
- they are approved
- they have an enrollment record
- enrollment status is `active`
- enrollment is not expired

Admins bypass enrollment checks.

## Lesson access rule

Students can access a lesson only when:
- lesson belongs to a course they are actively enrolled in
- lesson status is published
- section status is published
- course status is published

Admins may access draft content.

## Asset access rule

Students can access lesson assets only when:
- authenticated
- approved
- actively enrolled in the parent course
- active session exists
- asset belongs to a lesson they can access

The backend must issue signed URLs or playback tokens.

The system must never expose unrestricted direct video or file URLs.

## Comment permissions

### Student permissions
- create comment on lesson they can access
- reply to comment on lesson they can access
- edit own comment within allowed policy window if enabled
- delete own comment within allowed policy window if enabled

### Student restrictions
- cannot edit comments from other users
- cannot hide or moderate comments
- cannot comment on lessons from courses they are not enrolled in

### Admin permissions
- create comments and replies
- hide comments
- delete comments
- view all comments
- moderate abusive content

## Progress permissions

### Student permissions
- create own lesson progress record
- update own lesson progress record
- read own lesson progress

### Student restrictions
- cannot read other users' progress
- cannot write other users' progress

### Admin permissions
- read all progress data
- optional manual support override later

## Approval permissions

### Guest
- no approval actions

### Pending user
- no approval actions

### Student
- no approval actions

### Admin
- approve user
- reject user
- suspend user later if implemented

Every approval decision must create an audit log entry.

## Course management permissions

### Student
- no course CRUD

### Admin
- create course
- update course
- archive course
- publish/unpublish course
- create/update sections
- create/update lessons
- attach assets
- reorder content

## Enrollment permissions

### Student
- cannot self-enroll directly in v1

### Admin
- grant enrollment
- revoke enrollment
- pause enrollment
- set enrollment expiry

## Session permissions

### One active session policy
When a user logs in:
1. create or resolve device record
2. revoke previous active sessions
3. issue new active session

### Student
- may logout self
- may view own current session details if implemented later

### Admin
- may revoke user sessions
- may inspect suspicious access patterns

## Middleware / guard model

Recommended backend guard order:

1. `AuthGuard`
2. `SessionGuard`
3. `ApprovedUserGuard`
4. `RoleGuard`
5. `EnrollmentGuard`
6. `OwnershipGuard`

### Examples

#### Public routes
- no auth required

#### Student app routes
- `AuthGuard`
- `SessionGuard`
- `ApprovedUserGuard`

#### Admin routes
- `AuthGuard`
- `SessionGuard`
- `ApprovedUserGuard`
- `RoleGuard(admin)`

#### Lesson routes
- `AuthGuard`
- `SessionGuard`
- `ApprovedUserGuard`
- `EnrollmentGuard`

#### Progress update routes
- `AuthGuard`
- `SessionGuard`
- `ApprovedUserGuard`
- `OwnershipGuard`

## Ownership rules

Ownership-restricted resources:
- profile
- progress
- own comments
- own active session metadata

Admins can bypass ownership only for moderation/support endpoints.

## Audit requirements

Actions that must always be logged:
- user approved
- user rejected
- enrollment granted
- enrollment revoked
- session revoked
- course created
- course updated
- lesson updated
- comment hidden
- comment deleted

## Security principles

- frontend visibility is not permission
- backend is the source of truth
- role alone is not enough
- approval and enrollment checks are mandatory
- session validity is mandatory for protected content
- signed URLs must be short-lived

## v1 policy summary

- Guest: browse only
- Pending user: login but no learning access
- Student: access enrolled published content only
- Admin: full management and moderation
