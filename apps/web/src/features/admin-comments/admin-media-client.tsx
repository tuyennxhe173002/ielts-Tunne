'use client';

import { useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';

type MediaItem = {
  id: string;
  displayName: string;
  assetType: string;
  provider: string;
  metadataJson?: Record<string, unknown> | null;
  lesson: { title: string; course: { title: string; slug: string } };
};

export function AdminMediaClient() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState('Đang tải media...');

  useEffect(() => {
    authedApiRequest<MediaItem[]>('/admin/media')
      .then((data) => {
        setItems(data);
        setMessage('');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không tải được media'));
  }, []);

  return (
    <section className="glass p-6">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-blue-300">Media library</p>
      <p className="mb-4 text-slate-300">{message || 'Asset/video mới nhất trong hệ thống.'}</p>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <p className="font-medium text-white">{item.displayName}</p>
            <p className="text-sm text-slate-400">{item.lesson.course.title} · {item.lesson.title}</p>
            <p className="mt-1 text-sm text-blue-300">{item.assetType} · {item.provider}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
