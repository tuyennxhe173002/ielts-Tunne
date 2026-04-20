import { LoginForm } from '@/src/features/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[100vh] h-screen bg-white overflow-hidden">
      {/* Left Side: Inspiring Background */}
      <section className="hidden lg:flex w-full lg:w-1/2 relative items-center justify-center p-8 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Inspiration" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2670&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#007BA7]/90 to-[#006184]/80 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDmCGUIwQex0BBA62wiJMwhIarY3KRcxnDhpCPlKksKZd_-cqnLwIf99Fxzdne0eJiQ-hZFLqfwtucp0b-sK9u3FnQMDHiu8ZSrWfPHSFlwcezXJCBDaHjGXwdBZRjT8CEKo4F7nusBODPcqUSjbVFp9y_9t_81ljImVdwA0bLqYFiKmQU2jnd1mofy8hSCD5qVMW18nNmxbvH-8kudMClZw1wmnuBE9j3S_akvKgZY87HLmxfXuXhEuwTworHrWm1BdwUOZroBY8E')" }}></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-white text-[2.5rem] lg:text-[3rem] font-semibold tracking-[-0.02em] leading-tight mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Chinh phục IELTS
          </h1>
          <p className="text-[#f5faff] text-[1.05rem] font-medium opacity-90" style={{ lineHeight: 1.6 }}>
              Nâng tầm tư duy, mở rộng tương lai cùng lộ trình cá nhân hóa được thiết kế bởi các chuyên gia hàng đầu. Đỉnh cao học thuật bắt đầu từ hôm nay.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="bg-white/20 backdrop-blur-[24px] p-5 rounded-xl border border-white/10 flex flex-col gap-1 flex-1 shadow-lg">
                  <span className="text-white font-bold text-2xl tracking-tight">95%</span>
                  <span className="text-white/80 text-sm font-medium tracking-wide">Học viên đạt mục tiêu</span>
              </div>
              <div className="bg-white/20 backdrop-blur-[24px] p-5 rounded-xl border border-white/10 flex flex-col gap-1 flex-1 shadow-lg">
                  <span className="text-white font-bold text-2xl tracking-tight">8.5+</span>
                  <span className="text-white/80 text-sm font-medium tracking-wide">Điểm TB Speaking</span>
              </div>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form container */}
      <section className="w-full lg:w-1/2 flex items-center justify-center bg-[#f7f9fb] p-6 sm:p-8 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-[#ffffff] rounded-[2rem] p-6 sm:p-10 shadow-[0_10px_40px_rgba(25,28,30,0.06)] border border-[#bfc8cf]/15">
            <header className="mb-6">
                <h2 className="text-[#191c1e] text-[1.75rem] font-semibold tracking-[-0.02em] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Chào mừng trở lại</h2>
                <p className="text-[#3f484e] text-sm" style={{ lineHeight: 1.6 }}>Đăng nhập để tiếp tục lộ trình học của bạn</p>
            </header>

            <LoginForm />

          </div>
        </div>
      </section>
    </div>
  );
}
