import { RegisterForm } from '@/src/features/auth/register-form';

export default function RegisterPage() {
  return (
    <section className="space-y-5">
      <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Đăng ký</p>
      <h1 className="text-4xl font-semibold">Tạo tài khoản chờ admin duyệt.</h1>
      <RegisterForm />
    </section>
  );
}
