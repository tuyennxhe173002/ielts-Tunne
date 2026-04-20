import { RegisterForm } from '@/src/features/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[100vh] h-screen bg-white overflow-hidden">
      {/* Left Column: Brand & Visuals */}
      <section className="hidden lg:flex w-full lg:w-1/2 relative flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-[#006184] via-[#007ba7] to-[#004c69] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#7cd0ff]/20 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 mt-8">
          <div className="text-white">
            <h2 className="text-xl font-semibold tracking-tighter mb-8">IELTS Nguyễn Tuyển</h2>
            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
                Precision <br/>through <span className="text-[#c4e7ff]">Breath.</span>
            </h1>
            <p className="text-base text-[#c4e7ff]/80 max-w-md leading-relaxed font-medium">
                Hành trình chinh phục IELTS chuyên nghiệp với phương pháp học hiện đại và lộ trình cá nhân hóa.
            </p>
          </div>
        </div>
        
        <div className="relative z-10 p-5 rounded-xl max-w-sm mb-8" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(24px)', border: '0.5px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }}>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#c4e7ff] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#006184]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Chứng chỉ uy tín</p>
              <p className="text-xs text-white/70">Hơn 5000+ học viên đạt band 7.5+</p>
            </div>
          </div>
          <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-[#7cd0ff]"></div>
          </div>
        </div>
      </section>

      {/* Right Column: Registration Form container */}
      <section className="w-full lg:w-1/2 bg-[#ffffff] flex items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md py-4">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tighter text-[#007ba7]">IELTS Nguyễn Tuyển</h2>
          </div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold tracking-tight text-[#191c1e] mb-1">Bắt đầu hành trình IELTS</h3>
            <p className="text-[#3f484e] text-sm leading-relaxed">Đăng ký tài khoản miễn phí để vào học ngay</p>
          </div>


          <RegisterForm />

          {/* Footer Small Links */}
          <div className="mt-16 sm:absolute sm:bottom-8 sm:inset-x-0 text-center w-full">
            <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.1em] text-[#6f787f]">
                <a className="hover:text-[#007BA7] transition-colors" href="#">Privacy Policy</a>
                <a className="hover:text-[#007BA7] transition-colors" href="#">Terms of Service</a>
                <a className="hover:text-[#007BA7] transition-colors" href="#">Support</a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
