export default function PendingApprovalPage() {
  return (
    <section className="glass max-w-3xl space-y-4 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Pending approval</p>
      <h1 className="text-4xl font-semibold">Tài khoản của bạn đang chờ admin duyệt.</h1>
      <p className="text-slate-300">Bạn đã đăng nhập thành công nhưng chưa được cấp quyền học. Khi admin duyệt, bạn có thể quay lại dashboard để bắt đầu học.</p>
    </section>
  );
}
