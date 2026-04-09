import { StudentCourseClient } from '@/src/features/course-learning/student-course-client';

export default async function StudentCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <StudentCourseClient slug={slug} />
  );
}
