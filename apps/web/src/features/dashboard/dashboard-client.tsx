'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/src/lib/api-client';
import { authedApiRequest } from '@/src/lib/authed-api';
import { clearTokens, getAccessToken } from '@/src/lib/auth-store';

type MeResponse = {
  id: string;
  email: string;
  role: string;
  status: string;
  fullName: string;
};

export function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [courseCount, setCourseCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [message, setMessage] = useState('Đang tải dashboard...');

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    Promise.all([
      apiRequest<MeResponse>('/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      authedApiRequest<Array<{ id: string }>>('/me/courses'),
      authedApiRequest<Array<{ id: string; status: string }>>('/me/progress'),
    ])
      .then(([data, courses, progress]) => {
        setUser(data);
        setCourseCount(courses.length);
        setProgressCount(progress.filter((item) => item.status === 'completed').length);
        setMessage('');
      })
      .catch((error) => {
        clearTokens();
        setMessage(error instanceof Error ? error.message : 'Phiên đăng nhập không hợp lệ');
        router.replace('/login');
      });
  }, [router]);

  if (!user) return <section className="glass p-6 text-slate-300">{message}</section>;

  return (
    <section className="glass flex flex-wrap items-center justify-between gap-4 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Dashboard</p>
        <h1 className="text-4xl font-semibold">Xin chào, {user.fullName || user.email}</h1>
        <p className="mt-2 text-slate-300">Role: {user.role} | Status: {user.status}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"><p className="text-sm text-slate-400">Khóa học</p><strong className="text-3xl">{courseCount}</strong></article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"><p className="text-sm text-slate-400">Lessons hoàn thành</p><strong className="text-3xl">{progressCount}</strong></article>
      </div>
    </section>
  );
}
