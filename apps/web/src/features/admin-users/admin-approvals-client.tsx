'use client';

import { useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';

type PendingUser = {
  id: string;
  email: string;
  profile: { fullName: string | null } | null;
  status: string;
};

export function AdminApprovalsClient() {
  const [items, setItems] = useState<PendingUser[]>([]);
  const [message, setMessage] = useState('Đang tải approvals...');

  useEffect(() => {
    authedApiRequest<PendingUser[]>('/admin/approvals/pending')
      .then((data) => {
        setItems(data);
        setMessage('');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không tải được approvals'));
  }, []);

  return (
    <section className="glass p-6">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-blue-300">Approval queue</p>
      <p className="mb-4 text-slate-300">{message || 'Danh sách user chờ duyệt.'}</p>
      <div className="space-y-3">
        {items.length === 0 ? <p className="text-slate-500">Không có user pending.</p> : items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <p className="font-medium text-white">{item.profile?.fullName || item.email}</p>
            <p className="text-sm text-slate-400">{item.email}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
