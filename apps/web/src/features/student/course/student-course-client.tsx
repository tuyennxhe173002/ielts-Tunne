'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';

type Lesson = { id: string; slug: string; title: string; summary?: string | null; isPreview: boolean };
type Section = { id: string; title: string; description?: string | null; lessons: Lesson[] };
type Course = {
  id: string;
  title: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  category: { name: string };
  sections: Section[];
};

export function StudentCourseClient({ slug }: { slug: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [message, setMessage] = useState('Đang tải khóa học...');

  useEffect(() => {
    authedApiRequest<Course>(`/me/courses/${slug}`)
      .then((data) => {
        setCourse(data);
        setMessage('');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không tải được khóa học'));
  }, [slug]);

  if (!course) return <section className="glass p-6 text-slate-300">{message}</section>;

  return (
    <section className="space-y-6">
      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">{course.category.name}</p>
        <h1 className="text-4xl font-semibold">{course.title}</h1>
        <p className="mt-3 text-slate-300">{course.longDescription || course.shortDescription || 'Khóa học của bạn.'}</p>
      </article>
      <div className="space-y-4">
        {course.sections.map((section) => (
          <article key={section.id} className="glass p-6">
            <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
            <p className="mt-2 text-slate-400">{section.description || 'Section này chưa có mô tả.'}</p>
            <div className="mt-4 grid gap-3">
              {section.lessons.map((lesson) => (
                <Link key={lesson.id} className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-4 text-slate-200" href={`/lessons/${lesson.id}`}>
                  <p className="font-medium text-white">{lesson.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{lesson.summary || 'Lesson chưa có summary.'}</p>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
