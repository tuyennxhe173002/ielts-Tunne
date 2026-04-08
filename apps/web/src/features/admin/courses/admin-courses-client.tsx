'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/authed-api';

type Course = {
  id: string;
  slug: string;
  title: string;
  status: string;
  visibility: string;
  category: { name: string };
  _count: { sections: number; enrollments: number };
};

const categories = ['ielts', 'toeic', 'japanese', 'korean'] as const;

export function AdminCoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [message, setMessage] = useState('Đang tải khóa học...');
  const [form, setForm] = useState({ slug: '', title: '', categorySlug: 'ielts', shortDescription: '' });

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const data = await authedApiRequest<Course[]>('/admin/courses').catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không tải được khóa học');
      return null;
    });
    if (!data) return;
    setCourses(data);
    setMessage('');
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = await authedApiRequest<Course>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(form),
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Tạo khóa học thất bại');
      return null;
    });
    if (!data) return;
    setForm({ slug: '', title: '', categorySlug: 'ielts', shortDescription: '' });
    setMessage('Đã tạo khóa học thành công.');
    await loadCourses();
  }

  return (
    <section className="space-y-6">
      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Create course</p>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="slug" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} />
          <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="Tiêu đề khóa học" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          <select className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" value={form.categorySlug} onChange={(e) => setForm((s) => ({ ...s, categorySlug: e.target.value }))}>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="Mô tả ngắn" value={form.shortDescription} onChange={(e) => setForm((s) => ({ ...s, shortDescription: e.target.value }))} />
          <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white md:col-span-2">Tạo khóa học</button>
        </form>
      </article>

      <article className="glass p-6">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-blue-300">Course list</p>
        <p className="mb-4 text-slate-300">{message}</p>
        <div className="grid gap-3">
          {courses.map((course) => (
            <div key={course.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <div>
                <p className="font-medium text-white">{course.title}</p>
                <p className="text-sm text-slate-400">{course.slug} · {course.category.name} · {course.status}</p>
                <p className="text-sm text-slate-500">{course._count.sections} sections · {course._count.enrollments} enrollments</p>
              </div>
              <Link className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-200" href={`/admin/courses/${course.id}`}>Mở editor</Link>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
