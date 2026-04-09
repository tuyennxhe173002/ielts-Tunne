'use client';

import { useEffect, useMemo, useState } from 'react';
import { authedApiRequest } from '@/src/lib/api/authed-client';

type Course = { id: string; title: string; slug: string };
type Enrollment = { id: string; course: Course; status: string; expiresAt?: string | null };
type User = {
  id: string;
  email: string;
  status: string;
  profile: { fullName: string | null } | null;
  enrollments: Enrollment[];
};

export function AdminUsersClient() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [message, setMessage] = useState('Đang tải dữ liệu...');

  const userOptions = useMemo(() => users.filter((user) => user.status === 'approved'), [users]);

  useEffect(() => {
    Promise.all([
      authedApiRequest<User[]>('/admin/approvals/pending'),
      authedApiRequest<User[]>('/admin/users'),
      authedApiRequest<Course[]>('/admin/courses'),
    ])
      .then(([pending, allUsers, allCourses]) => {
        setPendingUsers(pending);
        setUsers(allUsers);
        setCourses(allCourses);
        setSelectedUserId(allUsers.find((user) => user.status === 'approved')?.id || '');
        setSelectedCourseId(allCourses[0]?.id || '');
        setMessage('');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không tải được dữ liệu admin'));
  }, []);

  async function decide(userId: string, action: 'approve' | 'reject') {
    const data = await authedApiRequest<{ ok: boolean }>(`/admin/approvals/${userId}/${action}`, {
      method: 'POST',
      body: JSON.stringify({ note: `${action} by admin UI` }),
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Thao tác thất bại');
      return null;
    });
    if (!data) return;
    setMessage(action === 'approve' ? 'Đã duyệt học viên.' : 'Đã từ chối học viên.');
    const [pending, allUsers] = await Promise.all([
      authedApiRequest<User[]>('/admin/approvals/pending'),
      authedApiRequest<User[]>('/admin/users'),
    ]);
    setPendingUsers(pending);
    setUsers(allUsers);
  }

  async function grantEnrollment() {
    if (!selectedUserId || !selectedCourseId) return;
    const data = await authedApiRequest('/admin/enrollments', {
      method: 'POST',
      body: JSON.stringify({ userId: selectedUserId, courseId: selectedCourseId }),
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Gán khóa học thất bại');
      return null;
    });
    if (!data) return;
    setMessage('Đã gán khóa học thành công.');
    const allUsers = await authedApiRequest<User[]>('/admin/users');
    setUsers(allUsers);
  }

  async function updateEnrollment(enrollmentId: string, payload: { status?: string; expiresAt?: string | null }) {
    await authedApiRequest(`/admin/enrollments/${enrollmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }).then(() => setMessage('Đã cập nhật enrollment.')).catch((error) => setMessage(error instanceof Error ? error.message : 'Cập nhật enrollment thất bại'));
    const allUsers = await authedApiRequest<User[]>('/admin/users');
    setUsers(allUsers);
  }

  return (
    <section className="space-y-6">
      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Pending approvals</p>
        <p className="mb-4 mt-2 text-slate-300">{message || 'Danh sách học viên chờ duyệt.'}</p>
        <div className="space-y-3">
          {pendingUsers.length === 0 ? <p className="text-slate-400">Không có học viên chờ duyệt.</p> : pendingUsers.map((user) => (
            <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <div>
                <p className="font-medium text-white">{user.profile?.fullName || user.email}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
              <div className="flex gap-3">
                <button className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white" onClick={() => decide(user.id, 'approve')}>Duyệt</button>
                <button className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white" onClick={() => decide(user.id, 'reject')}>Từ chối</button>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Grant enrollment</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <select className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">Chọn học viên</option>
            {userOptions.map((user) => <option key={user.id} value={user.id}>{user.profile?.fullName || user.email}</option>)}
          </select>
          <select className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
            <option value="">Chọn khóa học</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
          <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white" onClick={grantEnrollment}>Gán khóa học</button>
        </div>
      </article>

      <article className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Approved users</p>
        <div className="mt-4 space-y-3">
          {userOptions.map((user) => (
            <div key={user.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{user.profile?.fullName || user.email}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
                <span className="text-sm text-blue-300">{user.enrollments.length} khóa học</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {user.enrollments.length === 0 ? <span className="text-sm text-slate-500">Chưa được gán khóa học</span> : user.enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-300">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>{enrollment.course.title}</span>
                      <span className="text-xs text-blue-300">{enrollment.status}</span>
                      <button className="rounded-xl border border-white/10 px-2 py-1 text-xs" onClick={() => updateEnrollment(enrollment.id, { status: 'paused' })}>Pause</button>
                      <button className="rounded-xl border border-white/10 px-2 py-1 text-xs" onClick={() => updateEnrollment(enrollment.id, { status: 'active' })}>Activate</button>
                      <button className="rounded-xl border border-white/10 px-2 py-1 text-xs" onClick={() => updateEnrollment(enrollment.id, { status: 'revoked' })}>Revoke</button>
                      <button className="rounded-xl border border-white/10 px-2 py-1 text-xs" onClick={() => updateEnrollment(enrollment.id, { expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() })}>+30d</button>
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
