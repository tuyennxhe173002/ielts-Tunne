import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <main className="shell space-y-6">{children}</main>;
}
