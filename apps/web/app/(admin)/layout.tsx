import type { ReactNode } from 'react';
import Link from 'next/link';

const adminNav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/approvals', label: 'Approvals' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/comments', label: 'Comments' },
  { href: '/admin/notifications', label: 'Notifications' },
  { href: '/admin/audit-logs', label: 'Audit logs' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="shell grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="glass h-fit p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Admin navigation</p>
        <nav className="mt-4 grid gap-2">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-slate-200 transition hover:border-blue-400/40 hover:bg-slate-900/70">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="space-y-6">{children}</section>
    </main>
  );
}
