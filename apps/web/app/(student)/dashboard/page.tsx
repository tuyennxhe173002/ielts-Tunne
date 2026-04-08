import { DashboardClient } from '@/src/features/dashboard/dashboard-client';

export default function DashboardPage() {
  return (
    <>
      <DashboardClient />
      <section className="glass p-6">
        <h2 className="text-2xl font-semibold">Tiếp tục học</h2>
        <p className="mt-2 text-slate-300">Trang dashboard sẽ nối với progress, enrollments và comments sau khi backend sẵn sàng.</p>
      </section>
    </>
  );
}
