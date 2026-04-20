'use client';

import { FormEvent, useState } from 'react';
import { apiRequest } from '@/src/lib/api/client';

export function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Đăng ký thất bại');
      setSuccess(false);
    }
  }

  return (
    <>
      {/* Toast Notification */}
      {success && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white/90 backdrop-blur-[24px] shadow-[0_10px_40px_-10px_rgba(25,28,30,0.06)] px-6 py-4 rounded-xl flex items-center gap-4 border-l-4 border-[#006184]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#006184]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <p className="font-bold text-sm text-[#191c1e]">Đăng ký thành công</p>
                    <p className="text-xs text-[#3f484e]">Vui lòng check mail</p>
                </div>
                <button type="button" onClick={() => setSuccess(false)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
      )}

      <form className="space-y-3.5" onSubmit={onSubmit}>
        {/* Full Name */}
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#3f484e] block ml-1">Full Name</label>
            <div className="relative group">
                <input 
                  className="w-full px-5 py-3 bg-[#e6e8ea] border-none rounded-md focus:ring-0 focus:bg-white focus:outline focus:outline-1 focus:outline-[#006184] transition-all placeholder:text-[#6f787f] outline-none" 
                  placeholder="Nguyễn Văn A" 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
            </div>
        </div>
        
        {/* Email */}
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#006184] block ml-1">Email</label>
            <div className="relative">
                <input 
                  className="w-full px-5 py-3 bg-white border-none rounded-md ring-1 ring-[#006184] shadow-[0_0_10px_rgba(0,97,132,0.05)] transition-all outline-none" 
                  type="email" 
                  placeholder="nguyenvana@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>
        </div>
        
        {/* Password */}
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#3f484e] block ml-1">Password</label>
            <div className="relative group">
                <input 
                  className="w-full px-5 py-3 bg-[#e6e8ea] border-none rounded-md focus:ring-0 focus:bg-white focus:outline focus:outline-1 focus:outline-[#006184] transition-all placeholder:text-[#6f787f] outline-none" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f787f] hover:text-[#006184] transition-colors" 
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

        {/* Confirm Password */}
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#3f484e] block ml-1">Confirm Password</label>
            <div className="relative group">
                <input 
                  className="w-full px-5 py-3 bg-[#e6e8ea] border-none rounded-md focus:ring-0 focus:bg-white focus:outline focus:outline-1 focus:outline-[#006184] transition-all placeholder:text-[#6f787f] outline-none" 
                  placeholder="••••••••" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f787f] hover:text-[#006184] transition-colors" 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      {showConfirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.242m4.242 4.242L9.88 9.88" />
                      )}
                    </svg>
                </button>
            </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-2">
            <button type="submit" className="w-full py-3 bg-[#007ba7] text-white rounded-xl font-bold text-lg hover:scale-[1.02] hover:shadow-xl hover:shadow-[#007ba7]/20 active:scale-[0.98] transition-all duration-300">
                Tạo tài khoản
            </button>
        </div>
        
        {message && !success && (
          <p className="text-sm font-medium text-center text-[#ba1a1a] mt-2 bg-[#ffdad6]/50 p-2 rounded-lg">{message}</p>
        )}

        {/* Divider */}
        <div className="relative py-3">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#bfc8cf] opacity-30"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest text-[#3f484e] bg-white px-2 w-max mx-auto">Hoặc tiếp tục với</div>
        </div>

        {/* Social Login */}
        <button type="button" className="w-full flex items-center justify-center gap-3 py-3 bg-[#f2f4f6] text-[#191c1e] rounded-xl font-semibold hover:bg-[#eceef0] transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Sign up with Google
        </button>
      </form>

      {/* Footer of form */}
      <div className="mt-6 text-center">
          <p className="text-[#3f484e] font-medium text-sm">
              Đã có tài khoản? 
              <a className="text-[#007BA7] font-bold hover:underline ml-1" href="/login">Đăng nhập ngay</a>
          </p>
      </div>
    </>
  );
}
