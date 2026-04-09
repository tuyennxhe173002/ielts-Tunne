import { test, expect } from '@playwright/test';

test('admin can see pending users and approved enrollments UI', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('lms_access_token', 'admin-token');
    sessionStorage.setItem('current_user_email', 'admin@example.com');
    document.cookie = 'lms_csrf_token=csrf-token; path=/';
  });

  await page.route('**/api/v1/admin/approvals/pending', async (route) => {
    await route.fulfill({ json: { data: [{ id: 'u1', email: 'student@example.com', profile: { fullName: 'Student One' } }] } });
  });
  await page.route('**/api/v1/admin/users', async (route) => {
    await route.fulfill({
      json: {
        data: [
          { id: 'u1', email: 'student@example.com', status: 'approved', profile: { fullName: 'Student One' }, enrollments: [{ id: 'e1', status: 'active', course: { id: 'c1', title: 'IELTS Foundation', slug: 'ielts-foundation' } }] },
        ],
      },
    });
  });
  await page.route('**/api/v1/admin/courses', async (route) => {
    await route.fulfill({ json: { data: [{ id: 'c1', title: 'IELTS Foundation', slug: 'ielts-foundation' }] } });
  });
  await page.route('**/api/v1/admin/**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fulfill({ json: { data: { ok: true } } });
      return;
    }
    await route.fallback();
  });

  await page.goto('/admin/users');
  await expect(page.getByText('Quản lý học viên')).toBeVisible();
  await expect(page.locator('p.font-medium', { hasText: 'Student One' }).first()).toBeVisible();
  await expect(page.locator('span', { hasText: 'IELTS Foundation' }).first()).toBeVisible();
});
