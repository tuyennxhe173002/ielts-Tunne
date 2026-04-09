export default async function LearnPage({ params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }) {
  const { courseSlug, lessonSlug } = await params;
  return <main className="shell"><div className="glass p-8">Learn {courseSlug} / {lessonSlug}</div></main>;
}
