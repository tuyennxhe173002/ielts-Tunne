'use client';

import { useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/authed-api';

type CommentItem = {
  id: string;
  body: string;
  status: string;
  createdAt: string;
  lesson: { title: string; course: { title: string } };
  author: { email: string; profile: { fullName: string | null } | null; primaryRole: { code: string } };
};

export function AdminCommentsClient() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [message, setMessage] = useState('Đang tải comments...');

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    const data = await authedApiRequest<CommentItem[]>('/admin/comments').catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không tải được comments');
      return null;
    });
    if (!data) return;
    setComments(data);
    setMessage('');
  }

  async function moderate(commentId: string, action: 'hide' | 'delete') {
    await authedApiRequest(`/admin/comments/${commentId}/${action}`, { method: 'POST' }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Moderation thất bại');
      return null;
    });
    setMessage(action === 'hide' ? 'Đã ẩn comment.' : 'Đã xóa comment.');
    await loadComments();
  }

  return (
    <section className="glass p-6">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-blue-300">Moderation queue</p>
      <p className="mb-4 text-slate-300">{message || 'Danh sách comment gần đây'}</p>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">{comment.author.profile?.fullName || comment.author.email}</p>
                <p className="text-sm text-slate-400">{comment.lesson.course.title} · {comment.lesson.title}</p>
              </div>
              <span className="text-sm text-blue-300">{comment.status}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-slate-200">{comment.body}</p>
            <div className="mt-4 flex gap-3">
              <button className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-medium text-white" onClick={() => moderate(comment.id, 'hide')}>Ẩn</button>
              <button className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white" onClick={() => moderate(comment.id, 'delete')}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
