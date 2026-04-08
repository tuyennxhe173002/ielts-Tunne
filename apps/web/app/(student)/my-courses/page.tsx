import { MyCoursesClient } from '@/src/features/student/my-courses/my-courses-client';

export default function MyCoursesPage() {
  return (
    <>
      <section className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">My courses</p>
        <h1 className="text-4xl font-semibold">Khóa học đã được cấp quyền</h1>
        <p className="mt-2 text-slate-300">Danh sách khóa học active enrollment cho tài khoản hiện tại.</p>
      </section>
      <MyCoursesClient />
    </>
  );
}
