'use client';

import { FormEvent, useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  user: { email: string; profile: { fullName: string | null } | null };
};

export function AdminNotificationsClient() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [message, setMessage] = useState('Đang tải notifications...');
  const [form, setForm] = useState({ userId: '', type: 'manual', title: '', body: '' });

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    return authedApiRequest<NotificationItem[]>('/admin/notifications')
      .then((data) => {
        setItems(data);
        setMessage('');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không tải được notifications'));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await authedApiRequest('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(form),
    }).then(() => {
      setMessage('Đã tạo notification.');
      setForm({ userId: '', type: 'manual', title: '', body: '' });
    }).catch((error) => setMessage(error instanceof Error ? error.message : 'Không tạo được notification'));
    await loadNotifications();
  }

  return (
    <section className="glass p-6">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-blue-300">Notifications</p>
      <p className="mb-4 text-slate-300">{message || 'Thông báo gần đây trong hệ thống.'}</p>
      <form className="mb-6 grid gap-3 md:grid-cols-2" onSubmit={submit}>
        <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="User ID" value={form.userId} onChange={(e) => setForm((s) => ({ ...s, userId: e.target.value }))} />
        <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="Type" value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} />
        <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="Title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
        <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="Body" value={form.body} onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))} />
        <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white md:col-span-2">Tạo notification</button>
      </form>
      <div className="space-y-3">
        {items.length === 0 ? <p className="text-slate-500">Chưa có notification.</p> : items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <p className="font-medium text-white">{item.title}</p>
            <p className="text-sm text-blue-300">{item.type}</p>
            <p className="mt-1 text-sm text-slate-400">{item.body || 'Không có nội dung phụ.'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
