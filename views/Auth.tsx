
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, ShieldCheck, ChevronLeft } from 'lucide-react';
import { AppRoute, User } from '../types';
import { authService } from '../services/auth';

interface AuthProps {
  initialMode: 'login' | 'signup' | 'forgot';
  onAuthSuccess: (user: User) => void;
  onNavigate: (route: AppRoute) => void;
}

const Auth: React.FC<AuthProps> = ({ initialMode, onAuthSuccess, onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        const user = await authService.login(email, password);
        onAuthSuccess(user);
      } else if (mode === 'signup') {
        const user = await authService.signup(name, email, password);
        onAuthSuccess(user);
      } else {
        await authService.resetPassword(email);
        setSuccessMsg('Check your inbox! We sent you a password reset link.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100 border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                <ShieldCheck size={32} />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Join MediMind'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-slate-500 text-center mb-8">
              {mode === 'login' && 'Your medical records, safe and secure.'}
              {mode === 'signup' && 'Begin your journey to better health.'}
              {mode === 'forgot' && 'We\'ll help you get back into your account.'}
            </p>

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mb-6 bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-medium border border-emerald-100">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black font-bold"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black font-bold"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black font-bold"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              {mode === 'login' ? (
                <p className="text-slate-500 text-sm">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="font-bold text-blue-600 hover:underline">
                    Sign up
                  </button>
                </p>
              ) : mode === 'signup' ? (
                <p className="text-slate-500 text-sm">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="font-bold text-blue-600 hover:underline">
                    Log in
                  </button>
                </p>
              ) : (
                <button
                  onClick={() => setMode('login')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
                >
                  <ChevronLeft size={16} /> Back to login
                </button>
              )}
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400 uppercase tracking-widest font-bold">
          Encrypted with 256-bit SSL security
        </p>
      </div>
    </div>
  );
};

export default Auth;
