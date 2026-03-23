import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Mail, Lock, User as UserIcon, Phone, Calendar, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dob: '',
    gender: 'female',
    maritalStatus: 'single',
    voicePart: 'Soprano',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.email,
          subject: 'Inheritance Choir - Verify your email',
          text: 'Your verification code is: 123456',
        })
      });
      
      if (response.ok) {
        setStep(3); // Move to OTP
      } else {
        alert('Failed to send verification email.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending the verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(4); // Move to Success
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next input logic would go here
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
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 my-auto">
          
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-gold text-bg-base' : 'bg-bg-elevated text-text-muted border border-border-subtle'}`}>
                  {step > s ? <CheckCircle size={14} /> : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step > s ? 'bg-gold' : 'bg-bg-elevated'}`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-cinzel font-bold mb-1 gold-text">Personal Info</h2>
                <p className="text-sm text-text-muted">Tell us about yourself</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input type="text" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} placeholder="Jean Baptiste" className="w-full py-2.5 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input type="tel" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} placeholder="+250 788 000 000" className="w-full py-2.5 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input type="date" value={formData.dob} onChange={e=>setFormData({...formData, dob: e.target.value})} className="w-full py-2.5 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Gender</label>
                    <select value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})} className="w-full py-2.5 px-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Voice Part</label>
                    <select value={formData.voicePart} onChange={e=>setFormData({...formData, voicePart: e.target.value})} className="w-full py-2.5 px-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                      <option>Soprano</option>
                      <option>Alto</option>
                      <option>Tenor</option>
                      <option>Bass</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleNext} className="w-full py-3 gold-bg text-bg-base font-bold font-cinzel tracking-wide rounded-xl hover:brightness-110 transition-all flex justify-center items-center gap-2 mt-6">
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-cinzel font-bold mb-1 gold-text">Account Setup</h2>
                <p className="text-sm text-text-muted">Create your login credentials</p>
              </div>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} placeholder="your.email@example.com" className="w-full py-2.5 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input required type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} placeholder="Create a strong password" className="w-full py-2.5 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input required type="password" value={formData.confirmPassword} onChange={e=>setFormData({...formData, confirmPassword: e.target.value})} placeholder="Repeat your password" className="w-full py-2.5 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                  </div>
                </div>
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer text-sm text-text-secondary">
                    <input required type="checkbox" checked={formData.agreeTerms} onChange={e=>setFormData({...formData, agreeTerms: e.target.checked})} className="accent-gold rounded mt-1" />
                    <span className="leading-tight">I agree to the Terms of Service and consent to receive choir notifications.</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={handleBack} className="py-3 px-4 bg-transparent border border-border-default text-text-secondary font-bold rounded-xl hover:bg-white/5 transition-all flex items-center justify-center">
                    <ArrowLeft size={16} />
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 gold-bg text-bg-base font-bold font-cinzel tracking-wide rounded-xl hover:brightness-110 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                    {loading ? 'Processing...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-info/10 border-2 border-info/20 flex items-center justify-center mx-auto mb-6 text-info">
                <Mail size={28} />
              </div>
              <h2 className="text-2xl font-cinzel font-bold mb-2 gold-text">Check your email</h2>
              <p className="text-sm text-text-muted mb-8">We've sent a 6-digit verification code to<br/><strong className="text-text-primary">{formData.email || 'your email'}</strong></p>
              
              <div className="flex justify-center gap-2 mb-8">
                {otp.map((digit, i) => (
                  <input key={i} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} className="w-12 h-14 text-center text-xl font-bold bg-bg-input border border-border-default rounded-xl outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                ))}
              </div>

              <button onClick={handleVerifyOTP} disabled={loading} className="w-full py-3 gold-bg text-bg-base font-bold font-cinzel tracking-wide rounded-xl hover:brightness-110 transition-all flex justify-center items-center gap-2 disabled:opacity-70 mb-6">
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <p className="text-xs text-text-muted">Didn't receive the code? <button className="text-gold hover:underline">Resend in 0:59</button></p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/20 flex items-center justify-center mx-auto mb-6 text-success">
                <CheckCircle size={36} />
              </div>
              <h2 className="text-2xl font-cinzel font-bold mb-2 gold-text">You're Verified! 🎉</h2>
              
              <div className="bg-info/10 border border-info/20 rounded-xl p-4 mb-8 text-left">
                <p className="text-sm text-info leading-relaxed">
                  ℹ️ Your registration is pending admin approval.<br/>
                  You'll receive an email within 24-48 hours once approved.<br/>
                  Email: inheritancechoir@gmail.com
                </p>
              </div>

              <Link to="/login" className="block w-full py-3 bg-transparent border border-border-default text-text-primary font-bold font-cinzel tracking-wide rounded-xl hover:bg-white/5 transition-all">
                Back to Login
              </Link>
            </div>
          )}

          {step < 3 && (
            <div className="text-center mt-8 text-sm text-text-muted">
              Already have an account? <Link to="/login" className="text-gold hover:text-gold-bright transition-colors font-bold">Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
