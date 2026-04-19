'use client';

import { useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';

type AuditItem = {
  id: string;
  actionType: string;
  entityType: string;
  entityId?: string | null;
  createdAt: string;
  actor?: { email: string; profile: { fullName: string | null } | null } | null;
};

export function AdminAuditLogsClient() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [message, setMessage] = useState('Đang tải audit logs...');
  const [filters, setFilters] = useState({ actionType: '', entityType: '', actorEmail: '' });

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const query = new URLSearchParams();
    if (filters.actionType) query.set('actionType', filters.actionType);
    if (filters.entityType) query.set('entityType', filters.entityType);
    if (filters.actorEmail) query.set('actorEmail', filters.actorEmail);

    await authedApiRequest<AuditItem[]>(`/admin/audit-logs${query.toString() ? `?${query.toString()}` : ''}`)
      .then((data) => {
        setItems(data);
        setMessage('');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không tải được audit logs'));
  }

  return (
    <section className="glass p-6">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-blue-300">Audit logs</p>
      <p className="mb-4 text-slate-300">{message || 'Lịch sử hành động quản trị và hệ thống.'}</p>
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="Action" value={filters.actionType} onChange={(e) => setFilters((s) => ({ ...s, actionType: e.target.value }))} />
        <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="Entity" value={filters.entityType} onChange={(e) => setFilters((s) => ({ ...s, entityType: e.target.value }))} />
        <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" placeholder="Actor email" value={filters.actorEmail} onChange={(e) => setFilters((s) => ({ ...s, actorEmail: e.target.value }))} />
        <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white" onClick={loadLogs}>Lọc</button>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? <p className="text-slate-500">Chưa có audit logs.</p> : items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <p className="font-medium text-white">{item.actionType}</p>
            <p className="text-sm text-blue-300">{item.entityType} {item.entityId || ''}</p>
            <p className="mt-1 text-sm text-slate-400">{item.actor?.profile?.fullName || item.actor?.email || 'system'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
