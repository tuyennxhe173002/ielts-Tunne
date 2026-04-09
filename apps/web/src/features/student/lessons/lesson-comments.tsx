'use client';

import { FormEvent, useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';

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
  const [editDrafts, setEditDrafts] = useState<Record<string, string>>({});

  const currentUserEmail = typeof window !== 'undefined' ? sessionStorage.getItem('current_user_email') || '' : '';

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

  async function saveEdit(commentId: string) {
    const nextBody = editDrafts[commentId]?.trim();
    if (!nextBody) return;
    await authedApiRequest(`/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ body: nextBody }),
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không sửa được comment');
      return null;
    });
    await loadComments();
  }

  async function deleteComment(commentId: string) {
    await authedApiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không xóa được comment');
      return null;
    });
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
            {comment.author.email === currentUserEmail ? (
              <div className="mt-3 flex flex-wrap gap-3">
                <input className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" value={editDrafts[comment.id] ?? comment.body} onChange={(e) => setEditDrafts((state) => ({ ...state, [comment.id]: e.target.value }))} />
                <button className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200" onClick={() => saveEdit(comment.id)} type="button">Sửa</button>
                <button className="rounded-2xl border border-rose-500/40 px-4 py-3 text-rose-300" onClick={() => deleteComment(comment.id)} type="button">Xóa</button>
              </div>
            ) : null}

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
