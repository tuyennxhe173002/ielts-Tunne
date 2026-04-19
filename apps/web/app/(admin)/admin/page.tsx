import { AdminApprovalsClient } from '@/src/features/admin-users/admin-approvals-client';
import { AdminAnalyticsClient } from '@/src/features/admin-comments/admin-analytics-client';
import { AdminCommentsClient } from '@/src/features/admin-comments/admin-comments-client';
import { AdminCoursesClient } from '@/src/features/admin-courses/admin-courses-client';
import { AdminUsersClient } from '@/src/features/admin-users/admin-users-client';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Admin CMS</p>
        <h1 className="text-4xl font-semibold">Quản trị học viên và khóa học</h1>
        <p className="mt-2 text-slate-300">Tổng quan điều hành hệ thống từ approvals, users, courses đến moderation.</p>
      </section>
      <AdminAnalyticsClient />
      <div className="grid gap-6 xl:grid-cols-2">
        <AdminApprovalsClient />
        <AdminUsersClient />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <AdminCoursesClient />
        <AdminCommentsClient />
      </div>
    </div>
  );
}
