import { AdminCoursesClient } from '@/src/features/admin/courses/admin-courses-client';

export default function AdminCoursesPage() {
  return (
    <>
      <section className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Admin courses</p>
        <h1 className="text-4xl font-semibold">Quản trị khóa học</h1>
        <p className="mt-2 text-slate-300">Tạo khóa học mới và truy cập editor theo từng course.</p>
      </section>
      <AdminCoursesClient />
    </>
  );
}
