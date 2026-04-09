'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';
import { clearTokens } from '@/src/lib/auth/token-store';

type EnrollmentCourse = {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string | null;
  category: { name: string };
  _count: { sections: number; lessons: number };
};

type Enrollment = {
  id: string;
  status: string;
  course: EnrollmentCourse;
};

export function MyCoursesClient() {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [message, setMessage] = useState('Đang tải khóa học của bạn...');

  useEffect(() => {
    authedApiRequest<Enrollment[]>('/me/courses')
      .then((data) => {
        setItems(data);
        setMessage('');
      })
      .catch((error) => {
        clearTokens();
        setMessage(error instanceof Error ? error.message : 'Không tải được khóa học');
      });
  }, []);

  if (message) return <section className="glass p-6 text-slate-300">{message}</section>;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="glass space-y-4 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">{item.course.category.name}</p>
          <h2 className="text-2xl font-semibold text-white">{item.course.title}</h2>
          <p className="text-sm text-slate-300">{item.course.shortDescription || 'Khóa học đã được cấp quyền cho tài khoản của bạn.'}</p>
          <p className="text-sm text-slate-400">{item.course._count.sections} sections · {item.course._count.lessons} lessons</p>
          <Link className="inline-flex rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white" href={`/my-courses/${item.course.slug}`}>
            Vào học
          </Link>
        </article>
      ))}
    </section>
  );
}
