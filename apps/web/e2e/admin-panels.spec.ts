import { test, expect } from '@playwright/test';

test('admin can open dashboard, approvals, media, notifications, and audit pages', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('lms_access_token', 'admin-token');
    sessionStorage.setItem('current_user_email', 'admin@example.com');
    document.cookie = 'lms_csrf_token=csrf-token; path=/';
  });

  await page.route('**/api/v1/admin/approvals/pending', async (route) => {
    await route.fulfill({ json: { data: [{ id: 'u1', email: 'student@example.com', profile: { fullName: 'Student One' }, status: 'pending' }] } });
  });
  await page.route('**/api/v1/admin/media', async (route) => {
    await route.fulfill({ json: { data: [{ id: 'a1', displayName: 'Lesson Video', assetType: 'video', provider: 'bunny_stream', lesson: { title: 'Lesson 1', course: { title: 'IELTS Foundation', slug: 'ielts-foundation' } } }] } });
  });
  await page.route('**/api/v1/admin/notifications', async (route) => {
    await route.fulfill({ json: { data: [{ id: 'n1', type: 'approval_granted', title: 'Approved', body: 'Student approved', user: { email: 'student@example.com', profile: { fullName: 'Student One' } } }] } });
  });
  await page.route('**/api/v1/admin/audit-logs', async (route) => {
    await route.fulfill({ json: { data: [{ id: 'l1', actionType: 'user.approved', entityType: 'user', entityId: 'u1', actor: { email: 'admin@example.com', profile: { fullName: 'Admin' } } }] } });
  });
  await page.route('**/api/v1/admin/analytics/summary', async (route) => {
    await route.fulfill({ json: { data: { users: 4, pendingUsers: 1, courses: 3, activeEnrollments: 6, comments: 8, notifications: 5, recentLogs: [{ id: 'l1', actionType: 'user.approved', actor: { email: 'admin@example.com', profile: { fullName: 'Admin' } } }] } } });
  });

  await page.goto('/admin');
  await expect(page.getByText('Quản trị học viên và khóa học')).toBeVisible();
  await expect(page.locator('p.text-sm', { hasText: 'Pending' }).first()).toBeVisible();
  await expect(page.locator('p.text-sm', { hasText: 'Courses' }).first()).toBeVisible();

  await page.goto('/admin/approvals');
  await expect(page.getByText('Approval queue')).toBeVisible();
  await expect(page.getByText('Student One')).toBeVisible();

  await page.goto('/admin/media');
  await expect(page.getByText('Media library')).toBeVisible();
  await expect(page.getByText('Lesson Video')).toBeVisible();

  await page.goto('/admin/notifications');
  await expect(page.getByText('Notifications')).toBeVisible();
  await expect(page.locator('p.font-medium', { hasText: 'Approved' }).first()).toBeVisible();

  await page.goto('/admin/audit-logs');
  await expect(page.getByText('Audit logs')).toBeVisible();
  await expect(page.getByText('user.approved')).toBeVisible();
});
