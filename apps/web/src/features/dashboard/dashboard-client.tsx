'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/src/lib/api/client';
import { authedApiRequest } from '@/src/lib/api/authed-client';
import { clearTokens, getAccessToken } from '@/src/lib/auth/token-store';
import type { DashboardResponse, MeResponse } from '@/src/types/auth';

export function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [courseCount, setCourseCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [continueLearning, setContinueLearning] = useState<DashboardResponse['continueLearning']>(null);
  const [recentProgress, setRecentProgress] = useState<DashboardResponse['recentProgress']>([]);
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
      authedApiRequest<DashboardResponse>('/me/dashboard'),
    ])
      .then(([data, dashboard]) => {
        setUser(data);
        setCourseCount(dashboard.totalCourses);
        setProgressCount(dashboard.completedLessons);
        setContinueLearning(dashboard.continueLearning);
        setRecentProgress(dashboard.recentProgress);
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
    <div className="space-y-6">
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

      <section className="glass space-y-4 p-6">
        <h2 className="text-2xl font-semibold">Tiếp tục học</h2>
        {continueLearning ? (
          <a className="block rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-4 text-slate-200" href={`/lessons/${continueLearning.lesson.id}`}>
            <p className="font-medium text-white">{continueLearning.lesson.title}</p>
            <p className="mt-1 text-sm text-slate-400">{continueLearning.lesson.course.title}</p>
          </a>
        ) : (
          <p className="text-slate-400">Chưa có bài học đang học dở.</p>
        )}
      </section>

      <section className="glass space-y-4 p-6">
        <h2 className="text-2xl font-semibold">Hoạt động gần đây</h2>
        {recentProgress.length === 0 ? (
          <p className="text-slate-400">Chưa có tiến độ nào được ghi nhận.</p>
        ) : (
          <div className="space-y-3">
            {recentProgress.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-4">
                <p className="font-medium text-white">{item.lesson.title}</p>
                <p className="mt-1 text-sm text-slate-400">{item.lesson.course.title} · {item.status}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
