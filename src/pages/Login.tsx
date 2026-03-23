import React, { useState } from 'react';
import { Music, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('laurentniyigena2@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (email === 'laurentniyigena2@gmail.com' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      } else {
        setError('Invalid credentials. Use: laurentniyigena2@gmail.com / admin123');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-base flex font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex w-5/12 bg-[radial-gradient(ellipse_at_30%_40%,rgba(201,168,76,0.07)_0%,transparent_65%),#0B1124] border-r border-border-subtle p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="absolute left-0 right-0 h-px bg-gold/5" style={{ top: `${28 + i * 9}%` }} />
          ))}
        </div>
        
        <div className="relative z-10">
          <div className="text-4xl text-gold font-cinzel font-black mb-2">♪</div>
          <h1 className="text-3xl font-cinzel font-black tracking-[3px] gold-text mb-1">INHERITANCE</h1>
          <h1 className="text-3xl font-cinzel font-black tracking-[3px] gold-text mb-4">CHOIR</h1>
          <p className="text-sm text-text-muted italic leading-relaxed">Voices united in worship and excellence</p>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          {[
            ['✅', 'Real-time attendance tracking'],
            ['💰', 'Tithe & contribution records'],
            ['🎵', 'Voice coordination & songs'],
            ['💬', 'Internal team messaging'],
            ['📊', 'Analytics & reports']
          ].map(([icon, text], i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-gold/5 rounded-xl border border-border-subtle">
              <span className="text-base">{icon}</span>
              <span className="text-xs text-text-secondary">{text}</span>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-text-muted tracking-[1.5px] relative z-10">
          © 2026 INHERITANCE CHOIR
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.18),rgba(201,168,76,0.04))] border-2 border-border-gold flex items-center justify-center mx-auto mb-4 text-2xl shadow-[0_0_30px_rgba(201,168,76,0.15)] text-gold">
              <Music size={28} />
            </div>
            <h2 className="text-2xl font-cinzel font-bold mb-1 gold-text">Welcome Back</h2>
            <p className="text-sm text-text-muted">Sign in to manage INHERITANCE CHOIR</p>
          </div>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-xl mb-5 text-error text-sm flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full py-2.5 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full py-2.5 pl-10 pr-10 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 pb-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary">
                <input type="checkbox" className="accent-gold rounded" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-gold hover:text-gold-bright transition-colors">Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 gold-bg text-bg-base font-bold font-cinzel tracking-wide rounded-xl hover:brightness-110 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In →'}
            </button>
          </form>

          <div className="text-center my-6 text-text-muted text-xs tracking-[1.5px]">— OR —</div>
          
          <Link to="/register" className="block text-center w-full py-3 bg-transparent border border-border-default text-text-secondary font-cinzel font-bold tracking-wide rounded-xl hover:bg-white/5 transition-all mb-6">
            Create Account
          </Link>

          <div className="text-center p-2.5 bg-info/5 border border-info/10 rounded-xl text-[11px] text-text-muted tracking-wide">
            🔒 256-bit Encrypted · bcrypt · Secure Sessions
          </div>
        </div>
      </div>
    </div>
  );
}
