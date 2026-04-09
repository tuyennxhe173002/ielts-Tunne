'use client';

import { FormEvent, useEffect, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';

type Asset = { id: string; displayName: string; assetType: string; provider: string; externalUrl?: string | null; storageKey?: string | null; metadataJson?: Record<string, unknown> | null };
type Lesson = { id: string; title: string; slug: string; summary?: string | null; status: string; assets: Asset[] };
type Section = { id: string; title: string; description?: string | null; lessons: Lesson[] };
type Course = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  status: string;
  visibility: string;
  sections: Section[];
};

export function AdminCourseEditorClient({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [message, setMessage] = useState('Đang tải editor...');
  const [sectionTitle, setSectionTitle] = useState('');
  const [lessonForms, setLessonForms] = useState<Record<string, { slug: string; title: string }>>({});
  const [assetForms, setAssetForms] = useState<Record<string, { displayName: string; assetType: string; provider: string; externalUrl: string }>>({});
  const [sectionEdits, setSectionEdits] = useState<Record<string, { title: string; description: string }>>({});
  const [lessonEdits, setLessonEdits] = useState<Record<string, { title: string; summary: string; status: string }>>({});
  const [assetEdits, setAssetEdits] = useState<Record<string, { displayName: string; externalUrl: string }>>({});
  const [assetFiles, setAssetFiles] = useState<Record<string, File | null>>({});

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function loadCourse() {
    const data = await authedApiRequest<Course>(`/admin/courses/${courseId}`).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Không tải được course editor');
      return null;
    });
    if (!data) return;
    setCourse(data);
    setMessage('');
  }

  async function updateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!course) return;
    const form = new FormData(event.currentTarget);
    await authedApiRequest(`/admin/courses/${courseId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: form.get('title'),
        shortDescription: form.get('shortDescription'),
        longDescription: form.get('longDescription'),
        status: form.get('status'),
        visibility: form.get('visibility'),
      }),
    }).then(() => setMessage('Đã cập nhật khóa học.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Cập nhật thất bại'));
    await loadCourse();
  }

  async function createSection() {
    if (!sectionTitle.trim()) return;
    await authedApiRequest(`/admin/courses/${courseId}/sections`, {
      method: 'POST',
      body: JSON.stringify({ title: sectionTitle }),
    }).then(() => setMessage('Đã tạo section.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Tạo section thất bại'));
    setSectionTitle('');
    await loadCourse();
  }

  async function updateSection(sectionId: string) {
    const form = sectionEdits[sectionId];
    if (!form) return;
    await authedApiRequest(`/admin/sections/${sectionId}`, {
      method: 'PATCH',
      body: JSON.stringify(form),
    }).then(() => setMessage('Đã cập nhật section.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Cập nhật section thất bại'));
    await loadCourse();
  }

  async function createLesson(sectionId: string) {
    const form = lessonForms[sectionId];
    if (!form?.slug || !form?.title) return;
    await authedApiRequest(`/admin/sections/${sectionId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(form),
    }).then(() => setMessage('Đã tạo lesson.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Tạo lesson thất bại'));
    setLessonForms((state) => ({ ...state, [sectionId]: { slug: '', title: '' } }));
    await loadCourse();
  }

  async function updateLesson(lessonId: string) {
    const form = lessonEdits[lessonId];
    if (!form) return;
    await authedApiRequest(`/admin/lessons/${lessonId}`, {
      method: 'PATCH',
      body: JSON.stringify(form),
    }).then(() => setMessage('Đã cập nhật lesson.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Cập nhật lesson thất bại'));
    await loadCourse();
  }

  async function createAsset(lessonId: string) {
    const form = assetForms[lessonId];
    if (!form?.displayName) return;
    await authedApiRequest(`/admin/lessons/${lessonId}/assets`, {
      method: 'POST',
      body: JSON.stringify(form),
    }).then(() => setMessage('Đã tạo asset.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Tạo asset thất bại'));
    setAssetForms((state) => ({ ...state, [lessonId]: { displayName: '', assetType: 'video', provider: 'external', externalUrl: '' } }));
    await loadCourse();
  }

  async function createBunnyVideo(lessonId: string) {
    await authedApiRequest(`/admin/lessons/${lessonId}/bunny-video`, {
      method: 'POST',
    }).then(() => setMessage('Đã tạo Bunny video placeholder. Dùng uploadUrl trong metadata để upload video.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Tạo Bunny video thất bại'));
    await loadCourse();
  }

  async function updateAsset(assetId: string) {
    const form = assetEdits[assetId];
    if (!form) return;
    await authedApiRequest(`/admin/assets/${assetId}`, {
      method: 'PATCH',
      body: JSON.stringify(form),
    }).then(() => setMessage('Đã cập nhật asset.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Cập nhật asset thất bại'));
    await loadCourse();
  }

  async function uploadBunnyVideoAsset(assetId: string) {
    const file = assetFiles[assetId];
    if (!file) {
      setMessage('Chưa chọn file video để upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1'}/admin/assets/${assetId}/bunny-upload`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('lms_access_token') || ''}`,
      },
      body: formData,
    }).then(async (response) => {
      if (!response.ok) throw new Error('Upload Bunny thất bại');
      return response.json();
    }).then(() => {
      setMessage('Đã upload video lên Bunny. Chờ webhook cập nhật trạng thái encode.');
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Upload Bunny thất bại');
    });
    await loadCourse();
  }

  async function removeSection(sectionId: string) {
    await authedApiRequest(`/admin/sections/${sectionId}`, { method: 'DELETE' }).then(() => setMessage('Đã xóa section.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Xóa section thất bại'));
    await loadCourse();
  }

  async function removeLesson(lessonId: string) {
    await authedApiRequest(`/admin/lessons/${lessonId}`, { method: 'DELETE' }).then(() => setMessage('Đã xóa lesson.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Xóa lesson thất bại'));
    await loadCourse();
  }

  async function removeAsset(assetId: string) {
    await authedApiRequest(`/admin/assets/${assetId}`, { method: 'DELETE' }).then(() => setMessage('Đã xóa asset.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Xóa asset thất bại'));
    await loadCourse();
  }

  if (!course) return <section className="glass p-6 text-slate-300">{message}</section>;

  return (
    <section className="space-y-6">
      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Course metadata</p>
        <p className="mb-4 mt-2 text-slate-300">{message}</p>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={updateCourse}>
          <input name="title" defaultValue={course.title} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
          <input value={course.slug} disabled className="rounded-2xl border border-white/10 bg-slate-900/30 px-4 py-3 text-slate-500" />
          <input name="shortDescription" defaultValue={course.shortDescription ?? ''} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
          <select name="status" defaultValue={course.status} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
            {['draft', 'published', 'archived'].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <textarea name="longDescription" defaultValue={course.longDescription ?? ''} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 md:col-span-2" rows={4} />
          <select name="visibility" defaultValue={course.visibility} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
            {['public', 'private'].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white">Lưu khóa học</button>
        </form>
      </article>

      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Sections</p>
        <div className="mt-4 flex gap-3">
          <input value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} placeholder="Tên section mới" className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
          <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white" onClick={createSection}>Tạo section</button>
        </div>
        <div className="mt-6 space-y-4">
          {course.sections.map((section) => (
            <div key={section.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                  <p className="text-sm text-slate-400">{section.description || 'Chưa có mô tả section'}</p>
                </div>
                <button className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white" onClick={() => removeSection(section.id)}>Xóa section</button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <input placeholder="Tên section" value={sectionEdits[section.id]?.title ?? section.title} onChange={(e) => setSectionEdits((state) => ({ ...state, [section.id]: { title: e.target.value, description: state[section.id]?.description ?? section.description ?? '' } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                <input placeholder="Mô tả section" value={sectionEdits[section.id]?.description ?? section.description ?? ''} onChange={(e) => setSectionEdits((state) => ({ ...state, [section.id]: { title: state[section.id]?.title ?? section.title, description: e.target.value } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                <button className="rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white" onClick={() => updateSection(section.id)}>Lưu section</button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <input placeholder="lesson-slug" value={lessonForms[section.id]?.slug || ''} onChange={(e) => setLessonForms((state) => ({ ...state, [section.id]: { ...(state[section.id] || { title: '' }), slug: e.target.value } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                <input placeholder="Tên lesson" value={lessonForms[section.id]?.title || ''} onChange={(e) => setLessonForms((state) => ({ ...state, [section.id]: { ...(state[section.id] || { slug: '' }), title: e.target.value } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white" onClick={() => createLesson(section.id)}>Tạo lesson</button>
              </div>

              <div className="mt-4 space-y-3">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{lesson.title}</p>
                        <p className="text-sm text-slate-400">{lesson.slug} · {lesson.status}</p>
                      </div>
                      <button className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white" onClick={() => removeLesson(lesson.id)}>Xóa lesson</button>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_160px_auto]">
                      <input placeholder="Tên lesson" value={lessonEdits[lesson.id]?.title ?? lesson.title} onChange={(e) => setLessonEdits((state) => ({ ...state, [lesson.id]: { title: e.target.value, summary: state[lesson.id]?.summary ?? lesson.summary ?? '', status: state[lesson.id]?.status ?? lesson.status } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                      <input placeholder="Summary" value={lessonEdits[lesson.id]?.summary ?? lesson.summary ?? ''} onChange={(e) => setLessonEdits((state) => ({ ...state, [lesson.id]: { title: state[lesson.id]?.title ?? lesson.title, summary: e.target.value, status: state[lesson.id]?.status ?? lesson.status } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                      <select value={lessonEdits[lesson.id]?.status ?? lesson.status} onChange={(e) => setLessonEdits((state) => ({ ...state, [lesson.id]: { title: state[lesson.id]?.title ?? lesson.title, summary: state[lesson.id]?.summary ?? lesson.summary ?? '', status: e.target.value } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                        {['draft', 'published', 'archived'].map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                      <button className="rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white" onClick={() => updateLesson(lesson.id)}>Lưu lesson</button>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-[1fr_140px_140px_1fr_auto]">
                      <input placeholder="Tên asset" value={assetForms[lesson.id]?.displayName || ''} onChange={(e) => setAssetForms((state) => ({ ...state, [lesson.id]: { ...(state[lesson.id] || { assetType: 'video', provider: 'external', externalUrl: '' }), displayName: e.target.value } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                      <select value={assetForms[lesson.id]?.assetType || 'video'} onChange={(e) => setAssetForms((state) => ({ ...state, [lesson.id]: { ...(state[lesson.id] || { displayName: '', provider: 'external', externalUrl: '' }), assetType: e.target.value } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                        {['video', 'pdf', 'doc', 'slide', 'audio', 'image', 'link'].map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                      <select value={assetForms[lesson.id]?.provider || 'external'} onChange={(e) => setAssetForms((state) => ({ ...state, [lesson.id]: { ...(state[lesson.id] || { displayName: '', assetType: 'video', externalUrl: '' }), provider: e.target.value } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                        {['external', 'bunny_stream', 'r2', 's3'].map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                      <input placeholder="Link hoặc storage key" value={assetForms[lesson.id]?.externalUrl || ''} onChange={(e) => setAssetForms((state) => ({ ...state, [lesson.id]: { ...(state[lesson.id] || { displayName: '', assetType: 'video', provider: 'external' }), externalUrl: e.target.value } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                      <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white" onClick={() => createAsset(lesson.id)}>Add asset</button>
                    </div>
                    <div className="mt-3 flex gap-3">
                      <button className="rounded-2xl bg-violet-500 px-4 py-3 font-medium text-white" onClick={() => createBunnyVideo(lesson.id)}>Create Bunny video</button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {lesson.assets.map((asset) => (
                        <div key={asset.id} className="w-full rounded-2xl border border-white/10 bg-slate-900/50 p-3">
                          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
                            <input value={assetEdits[asset.id]?.displayName ?? asset.displayName} onChange={(e) => setAssetEdits((state) => ({ ...state, [asset.id]: { displayName: e.target.value, externalUrl: state[asset.id]?.externalUrl ?? asset.externalUrl ?? asset.storageKey ?? '' } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                            <input value={assetEdits[asset.id]?.externalUrl ?? asset.externalUrl ?? asset.storageKey ?? ''} onChange={(e) => setAssetEdits((state) => ({ ...state, [asset.id]: { displayName: state[asset.id]?.displayName ?? asset.displayName, externalUrl: e.target.value } }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" />
                            <button className="rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white" onClick={() => updateAsset(asset.id)}>Lưu asset</button>
                            <button className="rounded-2xl bg-rose-500 px-4 py-3 font-medium text-white" onClick={() => removeAsset(asset.id)}>Xóa asset</button>
                          </div>
                          <p className="mt-2 text-sm text-slate-400">{asset.assetType} · {asset.provider}</p>
                          {asset.provider === 'bunny_stream' && asset.metadataJson ? (
                            <>
                              <div className="mt-3 flex flex-wrap gap-3">
                                <input type="file" accept="video/*" onChange={(e) => setAssetFiles((state) => ({ ...state, [asset.id]: e.target.files?.[0] || null }))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300" />
                                <button className="rounded-2xl bg-violet-500 px-4 py-3 font-medium text-white" onClick={() => uploadBunnyVideoAsset(asset.id)}>Upload to Bunny</button>
                              </div>
                              <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950/60 p-3 text-xs text-slate-400">{JSON.stringify(asset.metadataJson, null, 2)}</pre>
                            </>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
