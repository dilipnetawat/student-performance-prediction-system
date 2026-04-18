import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ShieldCheck, Mail, ArrowRight, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import { useStore } from '../lib/store';
import { Button } from '../components/ui/Button';

type Step = 'google' | 'otp' | 'success';

const API_URL = 'http://localhost:5000/api/auth/student';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export function StudentAuthPage() {
  const navigate = useNavigate();
  const { googleSignup } = useStore();
  const [step, setStep] = useState<Step>('google');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step !== 'google') return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 380,
          shape: 'pill',
          text: 'signup_with',
          logo_alignment: 'center',
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) existing.remove();
    };
  }, [step]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  async function handleGoogleResponse(response: { credential: string }) {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Google authentication failed'); setLoading(false); return; }
      if (data.verified) {
        googleSignup(data.data.name, data.data.email, data.data.token);
        setStep('success');
        setTimeout(() => navigate('/app'), 1500);
      } else {
        setEmail(data.data.email);
        setName(data.data.name);
        setStep('otp');
        setResendTimer(30);
      }
    } catch { setError('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d; });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  async function verifyOtp() {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) { setError('Please enter the complete 6-digit code'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'OTP verification failed'); setOtp(['', '', '', '', '', '']); inputRefs.current[0]?.focus(); setLoading(false); return; }
      googleSignup(data.data.name, data.data.email, data.data.token);
      setStep('success');
      setTimeout(() => navigate('/app'), 1500);
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  async function resendOtp() {
    if (resendTimer > 0) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to resend OTP'); return; }
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch { setError('Network error. Please try again.'); }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side: branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block space-y-6"
        >
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-xl">TrackEd</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Student Portal</p>
            </div>
          </Link>

          <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
            Your academic journey, <span className="text-blue-600">tracked & predicted</span>.
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed">
            Sign up as a student to access your personalized dashboard, track your performance, and get AI-powered insights.
          </p>

          <div className="space-y-3 pt-4">
            {[
              'View your performance analytics',
              'Get personalized improvement tips',
              'Track attendance & assignments',
            ].map((point) => (
              <div key={point} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <ShieldCheck size={12} className="text-blue-600" />
                </div>
                {point}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right side: form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <p className="font-semibold text-lg">TrackEd</p>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Google Sign Up */}
            {step === 'google' && (
              <motion.div key="google" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={18} className="text-blue-600" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Student Portal</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">Student Sign Up</h2>
                <p className="text-sm text-gray-500 mb-8">Create your student account using your Google account. Quick, easy, and secure.</p>

                <div className="flex flex-col items-center gap-6">
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 mb-1">Continue with Google</p>
                      <p className="text-xs text-gray-400">We'll send a verification code to your Gmail</p>
                    </div>
                    <div ref={googleBtnRef} className="min-h-[44px]" />
                  </div>

                  {loading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Authenticating with Google...
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
                )}

                <p className="mt-8 text-sm text-gray-500 text-center">
                  Are you a teacher? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">Sign up here</Link>
                </p>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
                </p>
              </motion.div>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={18} className="text-blue-600" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Verification</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">Check your email</h2>
                <p className="text-sm text-gray-500 mb-8">
                  We've sent a 6-digit verification code to<br />
                  <span className="text-blue-600 font-medium">{email}</span>
                </p>

                <div className="flex justify-center gap-2.5 mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onFocus={(e) => e.target.select()}
                      className="w-12 h-14 text-center text-xl font-bold rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {error && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
                )}

                <Button type="button" className="w-full" size="lg" icon={loading ? undefined : <ArrowRight size={18} />} onClick={verifyOtp} disabled={loading || otp.join('').length !== 6}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : 'Verify & Continue'}
                </Button>

                <div className="mt-4 flex items-center justify-between">
                  <button type="button" onClick={resendOtp} disabled={resendTimer > 0}
                    className={`text-sm flex items-center gap-1.5 transition-colors ${resendTimer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700 cursor-pointer'}`}>
                    <RotateCcw size={13} />
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                  </button>
                  <button type="button" onClick={() => { setStep('google'); setError(''); setOtp(['', '', '', '', '', '']); }}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    Use different account
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={36} className="text-green-500" />
                </motion.div>
                <h2 className="text-xl font-bold mb-2">Welcome, {name}! 🎉</h2>
                <p className="text-sm text-gray-500 mb-4">Your account has been verified. Redirecting to your dashboard...</p>
                <div className="flex items-center justify-center gap-2 text-blue-600 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading dashboard...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
