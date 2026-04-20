'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/src/lib/api/client';
import { saveAccessToken, saveCsrfToken } from '@/src/lib/auth/token-store';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Đang đăng nhập...');
    try {
      const data = await apiRequest<{ accessToken: string; csrfToken?: string; user: { status: string; email?: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, deviceFingerprint: 'web-browser', deviceName: navigator.userAgent }),
      });
      saveAccessToken(data.accessToken);
      if (data.csrfToken) saveCsrfToken(data.csrfToken);
      if (data.user.email) sessionStorage.setItem('current_user_email', data.user.email);
      router.push(data.user.status === 'approved' ? '/dashboard' : '/pending-approval');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    }
  }

  return (
    <>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
            <label className="block text-[0.75rem] font-semibold tracking-[0.05em] uppercase text-[#3f484e] ml-1">Email</label>
            <input 
              className="w-full px-5 py-3 bg-[#e6e8ea] rounded-xl border border-transparent focus:ring-0 focus:border-[#007BA7] transition-all duration-200 text-[#191c1e] placeholder:text-[#6f787f]/60 outline-none" 
              placeholder="example@gmail.com" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
        </div>

        <div className="space-y-1.5">
            <label className="block text-[0.75rem] font-semibold tracking-[0.05em] uppercase text-[#3f484e] ml-1">Mật khẩu</label>
            <div className="relative">
                <input 
                  className="w-full px-5 py-3 bg-[#e6e8ea] rounded-xl border border-transparent focus:ring-0 focus:border-[#007BA7] transition-all duration-200 text-[#191c1e] placeholder:text-[#6f787f]/60 outline-none" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f787f] hover:text-[#007BA7] transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.242m4.242 4.242L9.88 9.88" />
                      )}
                    </svg>
                </button>
            </div>
        </div>

        <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  className="h-4 w-4 rounded-md border-transparent bg-[#e6e8ea] text-[#007BA7] focus:ring-offset-0 focus:ring-[#007BA7]/20 outline-none" 
                  type="checkbox"
                />
                <span className="text-sm text-[#3f484e] group-hover:text-[#007BA7] transition-colors">Ghi nhớ đăng nhập</span>
            </label>
            <a className="text-sm font-semibold text-[#007BA7] hover:underline underline-offset-4" href="#">Quên mật khẩu?</a>
        </div>

        <button 
          className="w-full bg-[#007BA7] text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-[#006184] hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg shadow-[#007BA7]/20" 
          type="submit"
        >
            Đăng nhập
        </button>

        {message && (
          <p className="text-sm font-medium text-center text-[#ba1a1a] mt-2 bg-[#ffdad6]/50 p-2 rounded-lg">{message}</p>
        )}
      </form>

      <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#bfc8cf]/30"></div>
          </div>
          <div className="relative flex justify-center text-[0.75rem] font-bold tracking-[0.05em] uppercase">
              <span className="bg-[#ffffff] px-4 text-[#6f787f]">Hoặc</span>
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-3 py-3 px-6 rounded-xl border border-[#bfc8cf]/40 hover:bg-[#f2f4f6] active:bg-[#e0e3e5] transition-all duration-300 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-sm font-semibold text-[#3f484e] group-hover:text-[#191c1e] transition-colors">Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 py-3 px-6 rounded-xl border border-[#bfc8cf]/40 hover:bg-[#f2f4f6] active:bg-[#e0e3e5] transition-all duration-300 group">
              <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
              <span className="text-sm font-semibold text-[#3f484e] group-hover:text-[#191c1e] transition-colors">Facebook</span>
          </button>
      </div>

      <footer className="mt-6 text-center">
          <p className="text-[#3f484e] text-sm font-medium">
              Chưa có tài khoản? 
              <a className="text-[#007BA7] font-bold ml-1 hover:underline underline-offset-4" href="/register">Đăng ký ngay</a>
          </p>
      </footer>
    </>
  );
}
