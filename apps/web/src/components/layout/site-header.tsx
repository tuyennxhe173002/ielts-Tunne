import Link from 'next/link';

export function SiteHeader() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,97,132,0.06)] flex justify-between items-center px-6 lg:px-12 py-5 max-w-[1920px] mx-auto">
      <Link href="/" className="text-2xl font-semibold tracking-tighter text-[#006184]">
        IELTS Nguyễn Tuyển
      </Link>
      <div className="hidden md:flex items-center space-x-8 font-['Inter'] font-semibold tracking-tight leading-relaxed">
        <Link className="text-slate-600 hover:text-[#006184] transition-colors" href="/courses">Khóa học</Link>
        <Link className="text-slate-600 hover:text-[#006184] transition-colors" href="/roadmap">Lộ trình</Link>
        <Link className="text-slate-600 hover:text-[#006184] transition-colors" href="/dashboard">Dashboard</Link>
        <Link className="text-slate-600 hover:text-[#006184] transition-colors" href="/login">Đăng nhập</Link>
      </div>
      <Link href="/register" className="bg-[#007BA7] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#006184] hover:scale-[1.02] active:scale-95 transition-all duration-300">
        Bắt đầu học
      </Link>
    </nav>
  );
}
