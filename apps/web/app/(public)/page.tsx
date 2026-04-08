import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="glass grid gap-8 px-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Kiến trúc mới</p>
        <h2 className="text-5xl font-semibold leading-tight">Nền tảng học trực tuyến cho IELTS, TOEIC, Nhật, Hàn.</h2>
        <p className="max-w-2xl text-lg text-slate-300">
          Public LMS với duyệt thủ công, phân quyền theo khóa học, video lessons, tài liệu, comments,
          online progress, và one-active-session policy.
        </p>
        <div className="flex gap-4">
          <Link className="rounded-2xl bg-blue-500 px-5 py-3 font-medium text-white" href="/register">Bắt đầu đăng ký</Link>
          <Link className="rounded-2xl border border-white/10 px-5 py-3 font-medium text-slate-200" href="/courses">Xem khóa học</Link>
        </div>
      </div>
      <div className="grid gap-4">
        {['Manual approval', 'Per-course enrollment', 'Video + files + notes', 'Comments + progress'].map((item) => (
          <article key={item} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 text-slate-200">{item}</article>
        ))}
      </div>
    </section>
  );
}
