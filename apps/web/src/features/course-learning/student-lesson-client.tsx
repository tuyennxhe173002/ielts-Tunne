'use client';

import { useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';
import { LessonComments } from '@/src/features/comments/lesson-comments';

type Asset = {
  id: string;
  displayName: string;
  assetType: string;
  provider: string;
  externalUrl?: string | null;
  storageKey?: string | null;
};

type Lesson = {
  id: string;
  title: string;
  summary?: string | null;
  studyNote?: string | null;
  contentHtml?: string | null;
  lessonType: string;
  course: { slug: string; title: string };
  section: { title: string };
  assets: Asset[];
};

type Progress = {
  status: string;
  progressPercent: string | number;
  lastPositionSeconds?: number | null;
};

export function StudentLessonClient({ lessonId }: { lessonId: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [message, setMessage] = useState('Đang tải bài học...');
  const [videoOpening, setVideoOpening] = useState(false);

  useEffect(() => {
    Promise.all([
      authedApiRequest<Lesson>(`/lessons/${lessonId}`),
      authedApiRequest<Progress | null>(`/me/progress/lessons/${lessonId}`),
    ])
      .then(([lessonData, progressData]) => {
        setLesson(lessonData);
        setProgress(progressData);
        setMessage('');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không tải được bài học'));
  }, [lessonId]);

  async function updateProgress(next: Partial<Progress>) {
    const data = await authedApiRequest<Progress>(`/me/progress/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(next),
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Lưu progress thất bại');
      return null;
    });
    if (data) setProgress(data);
  }

  async function completeLesson() {
    const data = await authedApiRequest<Progress>(`/me/progress/lessons/${lessonId}/complete`, {
      method: 'POST',
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không thể hoàn thành bài học');
      return null;
    });
    if (data) setProgress(data);
  }

  async function openVideo() {
    setVideoOpening(true);
    const data = await authedApiRequest<{ playbackUrl: string }>(`/lessons/${lessonId}/playback-token`, {
      method: 'POST',
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không mở được video');
      return null;
    });
    setVideoOpening(false);
    if (data?.playbackUrl) window.open(data.playbackUrl, '_blank', 'noopener,noreferrer');
  }

  async function openAsset(assetId: string) {
    const data = await authedApiRequest<{ accessUrl: string }>(`/lessons/${lessonId}/assets/${assetId}/access-url`, {
      method: 'POST',
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không mở được tài liệu');
      return null;
    });
    if (data?.accessUrl) window.open(data.accessUrl, '_blank', 'noopener,noreferrer');
  }

  if (!lesson) return <section className="glass p-6 text-slate-300">{message}</section>;

  return (
    <section className="space-y-6">
      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">{lesson.course.title} · {lesson.section.title}</p>
        <h1 className="text-4xl font-semibold">{lesson.title}</h1>
        <p className="mt-3 text-slate-300">{lesson.summary || 'Bài học chưa có summary.'}</p>
      </article>

      <article className="glass p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Progress</p>
            <p className="text-slate-300">Status: {progress?.status || 'not_started'} · {progress?.progressPercent || 0}%</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200" onClick={() => updateProgress({ status: 'in_progress', progressPercent: 25 })}>Bắt đầu học</button>
            <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white" onClick={completeLesson}>Đánh dấu hoàn thành</button>
          </div>
        </div>
      </article>

      <article className="glass p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Video access</p>
            <p className="text-slate-300">Playback URL sẽ được cấp ngắn hạn từ backend sau khi kiểm tra quyền truy cập.</p>
          </div>
          <button className="rounded-2xl bg-violet-500 px-4 py-3 font-medium text-white" onClick={openVideo} disabled={videoOpening}>
            {videoOpening ? 'Đang mở video...' : 'Mở video bài học'}
          </button>
        </div>
      </article>

      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Study note</p>
        <p className="mt-2 whitespace-pre-wrap text-slate-300">{lesson.studyNote || 'Bài học chưa có study note.'}</p>
      </article>

      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Assets</p>
        <div className="mt-4 grid gap-3">
          {lesson.assets.length === 0 ? <p className="text-slate-400">Bài học chưa có asset.</p> : lesson.assets.map((asset) => (
            <button key={asset.id} className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-4 text-left text-slate-200" onClick={() => openAsset(asset.id)}>
              <p className="font-medium text-white">{asset.displayName}</p>
              <p className="mt-1 text-sm text-slate-400">{asset.assetType} · {asset.provider}</p>
            </button>
          ))}
        </div>
      </article>

      <LessonComments lessonId={lessonId} />
    </section>
  );
}
