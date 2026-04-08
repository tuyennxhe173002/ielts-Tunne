import { AdminUsersClient } from '@/src/features/admin/users/admin-users-client';

export default function AdminUsersPage() {
  return (
    <>
      <section className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Admin users</p>
        <h1 className="text-4xl font-semibold">Quản lý học viên</h1>
        <p className="mt-2 text-slate-300">Duyệt học viên, xem danh sách đã duyệt và gán khóa học trực tiếp từ màn hình này.</p>
      </section>
      <AdminUsersClient />
    </>
  );
}
