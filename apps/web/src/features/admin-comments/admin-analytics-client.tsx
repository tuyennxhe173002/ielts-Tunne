'use client';

import { useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';

type Summary = {
  users: number;
  pendingUsers: number;
  courses: number;
  activeEnrollments: number;
  comments: number;
  notifications: number;
  recentLogs: Array<{ id: string; actionType: string; actor?: { email: string; profile?: { fullName: string | null } | null } | null }>;
};

export function AdminAnalyticsClient() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [message, setMessage] = useState('Đang tải analytics...');

  useEffect(() => {
    authedApiRequest<Summary>('/admin/analytics/summary')
      .then((data) => {
        setSummary(data);
        setMessage('');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không tải được analytics'));
  }, []);

  if (!summary) return <section className="glass p-6 text-slate-300">{message}</section>;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          ['Users', summary.users],
          ['Pending', summary.pendingUsers],
          ['Courses', summary.courses],
          ['Enrollments', summary.activeEnrollments],
          ['Comments', summary.comments],
          ['Notifications', summary.notifications],
        ].map(([label, value]) => (
          <article key={String(label)} className="glass p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <strong className="mt-2 block text-3xl text-white">{value}</strong>
          </article>
        ))}
      </div>
      <section className="glass p-6">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-blue-300">Recent admin activity</p>
        <div className="space-y-3">
          {summary.recentLogs.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
              <p className="font-medium text-white">{item.actionType}</p>
              <p className="text-sm text-slate-400">{item.actor?.profile?.fullName || item.actor?.email || 'system'}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
