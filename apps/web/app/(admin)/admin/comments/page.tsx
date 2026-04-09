import { AdminCommentsClient } from '@/src/features/admin-comments/admin-comments-client';

export default function AdminCommentsPage() {
  return (
    <>
      <section className="glass p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Admin moderation</p>
        <h1 className="text-4xl font-semibold">Điều phối bình luận</h1>
        <p className="mt-2 text-slate-300">Danh sách comments mới nhất để admin ẩn hoặc xóa khi cần.</p>
      </section>
      <AdminCommentsClient />
    </>
  );
}
