const courses = [
  { slug: 'ielts-foundation', title: 'IELTS Foundation', category: 'IELTS' },
  { slug: 'toeic-core', title: 'TOEIC Core', category: 'TOEIC' },
  { slug: 'japanese-n5', title: 'Japanese N5', category: 'Japanese' },
  { slug: 'korean-topik-1', title: 'Korean TOPIK I', category: 'Korean' },
];

export default function CoursesPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-semibold">Khóa học công khai</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => (
          <article key={course.slug} className="glass space-y-3 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">{course.category}</p>
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-sm text-slate-300">Trang catalog mẫu cho khóa học đã publish.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
