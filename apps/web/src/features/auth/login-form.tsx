'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/src/lib/api-client';
import { saveAccessToken } from '@/src/lib/auth-store';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Đang đăng nhập...');
    try {
      const data = await apiRequest<{ accessToken: string; user: { status: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, deviceFingerprint: 'web-browser', deviceName: navigator.userAgent }),
      });
      saveAccessToken(data.accessToken);
      router.push(data.user.status === 'approved' ? '/dashboard' : '/pending-approval');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    }
  }

  return (
    <form className="glass space-y-4 p-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm text-slate-300">Email</label>
        <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300">Mật khẩu</label>
        <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      <button className="w-full rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white">Đăng nhập</button>
      <p className="text-sm text-slate-300">{message}</p>
    </form>
  );
}
