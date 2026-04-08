import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Nguyễn Tuyển LMS',
  description: 'Public LMS platform for IELTS, TOEIC, Japanese, and Korean courses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
