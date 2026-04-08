import { LoginForm } from '@/src/features/auth/login-form';

export default function LoginPage() {
  return (
    <div className="grid min-h-[80vh] items-center lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Đăng nhập</p>
        <h1 className="text-5xl font-semibold">Tiếp tục học với lộ trình cá nhân hóa.</h1>
        <p className="max-w-xl text-slate-300">Google OAuth và email/password sẽ được gắn với one-active-session policy trong backend NestJS.</p>
      </section>
      <LoginForm />
    </div>
  );
}
