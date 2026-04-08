export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <section className="glass space-y-4 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Course detail</p>
      <h1 className="text-4xl font-semibold">{slug}</h1>
      <p className="text-slate-300">Trang chi tiết khóa học public. Sẽ nối API public course detail sau.</p>
    </section>
  );
}
