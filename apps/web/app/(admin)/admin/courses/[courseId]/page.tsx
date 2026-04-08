import { AdminCourseEditorClient } from '@/src/features/admin/courses/admin-course-editor-client';

export default async function AdminCourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return (
    <>
      <section className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Course editor</p>
        <h1 className="text-4xl font-semibold">Editor khóa học {courseId}</h1>
        <p className="mt-2 text-slate-300">Chỉnh metadata, sections, lessons và lesson assets trực tiếp từ màn hình này.</p>
      </section>
      <AdminCourseEditorClient courseId={courseId} />
    </>
  );
}
