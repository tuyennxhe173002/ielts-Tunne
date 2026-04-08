import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="glass flex items-center justify-between px-6 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">IELTS Nguyễn Tuyển</p>
        <h1 className="text-lg font-semibold text-white">Public LMS Platform</h1>
      </div>
      <nav className="flex gap-3 text-sm text-slate-300">
        <Link href="/courses">Khóa học</Link>
        <Link href="/login">Đăng nhập</Link>
        <Link href="/register">Đăng ký</Link>
      </nav>
    </header>
  );
}
