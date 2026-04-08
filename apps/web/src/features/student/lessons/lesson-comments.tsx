'use client';

import { FormEvent, useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/authed-api';

type Author = {
  email: string;
  profile: { fullName: string | null } | null;
  primaryRole: { code: string };
};

type Reply = {
  id: string;
  body: string;
  author: Author;
  createdAt: string;
};

type CommentItem = {
  id: string;
  body: string;
  author: Author;
  createdAt: string;
  replies: Reply[];
};

export function LessonComments({ lessonId }: { lessonId: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('Đang tải comments...');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    loadComments();
  }, [lessonId]);

  async function loadComments() {
    const data = await authedApiRequest<CommentItem[]>(`/lessons/${lessonId}/comments`).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không tải được comments');
      return null;
    });
    if (!data) return;
    setComments(data);
    setMessage('');
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;
    await authedApiRequest(`/lessons/${lessonId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không gửi được comment');
      return null;
    });
    setBody('');
    await loadComments();
  }

  async function submitReply(commentId: string) {
    const reply = replyDrafts[commentId]?.trim();
    if (!reply) return;
    await authedApiRequest(`/lessons/${lessonId}/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ body: reply }),
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không gửi được reply');
      return null;
    });
    setReplyDrafts((state) => ({ ...state, [commentId]: '' }));
    await loadComments();
  }

  return (
    <article className="glass p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Comments & Q&A</p>
      <p className="mt-2 text-slate-300">{message || 'Đặt câu hỏi ngay dưới bài học để được giải đáp.'}</p>

      <form className="mt-4 space-y-3" onSubmit={submitComment}>
        <textarea className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Viết câu hỏi hoặc thắc mắc của bạn..." />
        <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white">Gửi comment</button>
      </form>

      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <p className="font-medium text-white">{comment.author.profile?.fullName || comment.author.email}</p>
            <p className="mt-2 whitespace-pre-wrap text-slate-200">{comment.body}</p>

            <div className="mt-4 space-y-3 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                  <p className="text-sm font-medium text-blue-300">{reply.author.profile?.fullName || reply.author.email} {reply.author.primaryRole.code === 'admin' ? '(admin)' : ''}</p>
                  <p className="mt-1 whitespace-pre-wrap text-slate-200">{reply.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <input className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" value={replyDrafts[comment.id] || ''} onChange={(e) => setReplyDrafts((state) => ({ ...state, [comment.id]: e.target.value }))} placeholder="Viết reply..." />
              <button className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200" onClick={() => submitReply(comment.id)} type="button">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
