import type { ReactNode } from 'react';
import { SiteHeader } from '@/src/components/site-header';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <main className="shell space-y-8">
      <SiteHeader />
      {children}
    </main>
  );
}
