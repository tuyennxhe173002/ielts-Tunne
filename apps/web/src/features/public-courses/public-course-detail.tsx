type PreviewLesson = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
};

type Section = {
  id: string;
  title: string;
  description?: string | null;
  lessons: PreviewLesson[];
};

type Course = {
  title: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  category: { name: string };
  sections: Section[];
};

export function PublicCourseDetail({ course }: { course: Course }) {
  return (
    <section className="space-y-6">
      <article className="glass space-y-4 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">{course.category.name}</p>
        <h1 className="text-4xl font-semibold">{course.title}</h1>
        <p className="text-slate-300">{course.longDescription || course.shortDescription || 'Khóa học công khai.'}</p>
      </article>
      <div className="space-y-4">
        {course.sections.map((section) => (
          <article key={section.id} className="glass p-6">
            <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
            <p className="mt-2 text-slate-400">{section.description || 'Section preview.'}</p>
            <div className="mt-4 grid gap-3">
              {section.lessons.length === 0 ? (
                <p className="text-slate-500">Chưa có lesson preview.</p>
              ) : (
                section.lessons.map((lesson) => (
                  <div key={lesson.id} className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-4">
                    <p className="font-medium text-white">{lesson.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{lesson.summary || 'Lesson preview'}</p>
                  </div>
                ))
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
