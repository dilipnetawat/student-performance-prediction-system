import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../lib/store';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import type { Role } from '../lib/types';

interface Props { mode: 'login' | 'signup'; }

export function AuthPage({ mode }: Props) {
  const navigate = useNavigate();
  const { login, signup } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(mode === 'login' ? 'demo@tracked.edu' : '');
  const [password, setPassword] = useState(mode === 'login' ? 'demo1234' : '');
  const [role, setRole] = useState<Role>('teacher');
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = mode === 'login' ? login(email, password) : signup(name, email, password, role);
    if (!res.ok) { setError(res.error || 'Something went wrong'); return; }
    navigate('/app');
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
              <p className="text-xs text-gray-400 uppercase tracking-wider">Predict Success</p>
            </div>
          </Link>

          <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
            {mode === 'login' ? <>Welcome back to your <span className="text-blue-600">command center</span>.</> : <>Join the future of <span className="text-blue-600">student success</span>.</>}
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed">
            {mode === 'login'
              ? 'Sign in to access your dashboard, run ML predictions, and stay ahead of every learning curve.'
              : 'Create your account in seconds and start tracking what matters most — your students.'}
          </p>

          <div className="space-y-3 pt-4">
            {[
              'Real-time analytics across your roster',
              'AI-powered risk predictions',
              'Personalized intervention recommendations',
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

        {/* Right side: form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <p className="font-semibold text-lg">TrackEd</p>
          </div>

          <h2 className="text-2xl font-bold mb-1">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login' ? 'Welcome back — let\'s pick up where you left off.' : 'Start your free trial today. No credit card required.'}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <Input label="Full name" icon={<User size={16} />} value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required />
            )}
            <Input label="Email" type="email" icon={<Mail size={16} />} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.edu" required />
            <Input label="Password" type="password" icon={<Lock size={16} />} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />

            {mode === 'signup' && (
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1.5">Role</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['admin', 'teacher', 'student'] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2.5 rounded-lg text-sm font-medium capitalize border transition-all ${
                        role === r
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" icon={<ArrowRight size={18} />}>
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>

            {mode === 'login' && (
              <div className="text-xs text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
                💡 Demo mode — any email & password will work
              </div>
            )}
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            {mode === 'login' ? (
              <>Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">Sign up</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link></>
            )}
          </p>

          {/* Student signup link */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              Are you a student?{' '}
              <Link
                to="/student-signup"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up with Google →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
