import { StudentLessonClient } from '@/src/features/course-learning/student-lesson-client';

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <StudentLessonClient lessonId={lessonId} />;
}
