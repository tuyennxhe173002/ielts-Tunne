import { test, expect } from '@playwright/test';

test('student can see dashboard, course, lesson, and comments UI', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('lms_access_token', 'student-token');
    sessionStorage.setItem('current_user_email', 'student@example.com');
    document.cookie = 'lms_csrf_token=csrf-token; path=/';
  });

  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({ json: { data: { id: 'u1', email: 'student@example.com', role: 'student', status: 'approved', fullName: 'Student One' } } });
  });
  await page.route('**/api/v1/me/dashboard', async (route) => {
    await route.fulfill({ json: { data: { totalCourses: 1, completedLessons: 2, continueLearning: { lesson: { id: 'l1', title: 'Lesson 1', course: { slug: 'ielts-foundation', title: 'IELTS Foundation' } } }, recentProgress: [{ id: 'p1', status: 'completed', lesson: { id: 'l1', title: 'Lesson 1', course: { slug: 'ielts-foundation', title: 'IELTS Foundation' } } }] } } });
  });
  await page.route('**/api/v1/me/courses**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/api/v1/me/courses')) {
      await route.fulfill({ json: { data: [{ id: 'e1', status: 'active', course: { id: 'c1', slug: 'ielts-foundation', title: 'IELTS Foundation', shortDescription: 'desc', category: { name: 'IELTS' }, _count: { sections: 1, lessons: 1 } } }] } });
      return;
    }
    await route.fulfill({ json: { data: { id: 'c1', title: 'IELTS Foundation', category: { name: 'IELTS' }, sections: [{ id: 's1', title: 'Section 1', lessons: [{ id: 'l1', slug: 'lesson-1', title: 'Lesson 1', summary: 'Summary', isPreview: false }] }] } } });
  });
  await page.route('**/api/v1/lessons/l1', async (route) => {
    await route.fulfill({ json: { data: { id: 'l1', title: 'Lesson 1', summary: 'Summary', studyNote: 'Study note', course: { slug: 'ielts-foundation', title: 'IELTS Foundation' }, section: { title: 'Section 1' }, assets: [] } } });
  });
  await page.route('**/api/v1/me/progress/lessons/l1', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: { data: { status: 'in_progress', progressPercent: 25 } } });
      return;
    }
    await route.fulfill({ json: { data: { status: 'completed', progressPercent: 100 } } });
  });
  await page.route('**/api/v1/me/progress', async (route) => {
    await route.fulfill({ json: { data: [{ id: 'p1', status: 'completed' }] } });
  });
  await page.route('**/api/v1/lessons/l1/comments', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: { data: [{ id: 'c1', body: 'Question', author: { email: 'student@example.com', profile: { fullName: 'Student One' }, primaryRole: { code: 'student' } }, replies: [] }] } });
      return;
    }
    await route.fulfill({ json: { data: { id: 'c2', body: 'New comment' } } });
  });
  await page.route('**/api/v1/comments/**', async (route) => {
    await route.fulfill({ json: { data: { ok: true } } });
  });
  await page.route('**/api/v1/lessons/l1/playback-token', async (route) => {
    await route.fulfill({ json: { data: { playbackUrl: 'https://example.com/video' } } });
  });

  await page.goto('/dashboard');
  await expect(page.getByText('Xin chào, Student One')).toBeVisible();
  await page.goto('/my-courses');
  await expect(page.getByText('IELTS Foundation')).toBeVisible();
  await page.goto('/my-courses/ielts-foundation');
  await expect(page.getByText('Section 1')).toBeVisible();
  await page.goto('/lessons/l1');
  await expect(page.locator('p', { hasText: 'Study note' }).first()).toBeVisible();
  await expect(page.getByText('Comments & Q&A')).toBeVisible();
});
