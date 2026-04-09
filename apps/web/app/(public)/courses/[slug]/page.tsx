import { PublicCourseDetail } from '@/src/features/public-courses/public-course-detail';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

async function getCourse(slug: string) {
  const response = await fetch(`${API_BASE_URL}/courses/${slug}`, { cache: 'no-store' });
  if (!response.ok) return null;
  const json = await response.json();
  return json.data;
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return (
      <section className="glass space-y-4 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Course detail</p>
        <h1 className="text-4xl font-semibold">Không tìm thấy khóa học</h1>
      </section>
    );
  }

  return <PublicCourseDetail course={course} />;
}
