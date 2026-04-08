'use client';

import { FormEvent, useState } from 'react';
import { apiRequest } from '@/src/lib/api-client';

export function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      return;
    }
    setMessage('Đang gửi đăng ký...');
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
      });
      setMessage('Đăng ký thành công. Chờ admin duyệt tài khoản.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Đăng ký thất bại');
    }
  }

  return (
    <form className="glass grid gap-4 p-6 md:grid-cols-2" onSubmit={onSubmit}>
      <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Họ và tên" />
      <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" />
      <input className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu" />
      <button className="rounded-2xl bg-blue-500 px-4 py-3 font-medium text-white md:col-span-2">Gửi đăng ký</button>
      <p className="text-sm text-slate-300 md:col-span-2">{message}</p>
    </form>
  );
}
