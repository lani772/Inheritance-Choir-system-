import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Key, Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Inheritance Choir - Password Reset',
          text: 'Your password reset code is: 123456',
        })
      });
      
      if (response.ok) {
        setStep(2);
      } else {
        alert('Failed to send reset code.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending the reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <div className="min-h-screen bg-bg-base flex font-sans items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-card border border-border-subtle rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center mx-auto mb-6 text-gold">
                <Key size={28} />
              </div>
              <h2 className="text-2xl font-cinzel font-bold mb-2 gold-text">Forgot Password?</h2>
              <p className="text-sm text-text-muted">Enter your email address and we'll send you a code to reset your password.</p>
            </div>

            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full py-3 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                </div>
              </div>

              <div className="p-3 bg-info/10 border border-info/20 rounded-xl text-xs text-info flex items-start gap-2">
                <span className="shrink-0 mt-0.5">ℹ️</span>
                <span>For security, we won't confirm if this email exists in our system.</span>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 gold-bg text-bg-base font-bold font-cinzel tracking-wide rounded-xl hover:brightness-110 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-info/10 border-2 border-info/20 flex items-center justify-center mx-auto mb-6 text-info">
              <Mail size={28} />
            </div>
            <h2 className="text-2xl font-cinzel font-bold mb-2 gold-text">Enter Reset Code</h2>
            <p className="text-sm text-text-muted mb-8">We've sent a 6-digit code to<br/><strong className="text-text-primary">{email}</strong></p>
            
            <div className="flex justify-center gap-2 mb-8">
              {otp.map((digit, i) => (
                <input key={i} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} className="w-12 h-14 text-center text-xl font-bold bg-bg-input border border-border-default rounded-xl outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              ))}
            </div>

            <button onClick={handleVerifyOTP} disabled={loading} className="w-full py-3 gold-bg text-bg-base font-bold font-cinzel tracking-wide rounded-xl hover:brightness-110 transition-all flex justify-center items-center gap-2 disabled:opacity-70 mb-6">
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <p className="text-xs text-text-muted">Didn't receive the code? <button className="text-gold hover:underline">Resend in 0:59</button></p>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-success/10 border-2 border-success/20 flex items-center justify-center mx-auto mb-6 text-success">
                <CheckCircle size={28} />
              </div>
              <h2 className="text-2xl font-cinzel font-bold mb-2 gold-text">Create New Password</h2>
              <p className="text-sm text-text-muted">Your new password must be different from previous used passwords.</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input required type="password" value={passwords.new} onChange={e=>setPasswords({...passwords, new: e.target.value})} placeholder="Min 8 chars, uppercase, number" className="w-full py-3 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input required type="password" value={passwords.confirm} onChange={e=>setPasswords({...passwords, confirm: e.target.value})} placeholder="Repeat new password" className="w-full py-3 pl-10 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 gold-bg text-bg-base font-bold font-cinzel tracking-wide rounded-xl hover:brightness-110 transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-6">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
