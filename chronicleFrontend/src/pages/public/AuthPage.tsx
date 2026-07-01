import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Icon } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@chronicle.press');
  const [password, setPassword] = useState('Password123!');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/admin';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!isLogin) {
      setError('Registration is not available yet. Use a seeded account to sign in.');
      toast.error('Registration is not available yet.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      toast.success('Welcome back.');
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Unable to sign in.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-0 md:p-8">
      <section className="flex h-screen w-full max-w-[1400px] overflow-hidden bg-white shadow-2xl md:h-[920px] md:rounded-xl">
        <div className="relative hidden w-1/2 overflow-hidden bg-primary md:block">
          <img className="h-full w-full object-cover opacity-70 transition duration-1000 hover:scale-105" src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85" alt="Editorial workspace" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-transparent" />
          <div className="absolute left-16 top-16 text-white"><h1 className="font-display text-6xl font-bold uppercase tracking-tight">CHRONICLE</h1><p className="mt-2 text-white/80">The architecture of truth.</p></div>
          <blockquote className="absolute bottom-16 left-16 right-16 border-l-4 border-secondary pl-6 text-white"><p className="font-display text-2xl italic leading-relaxed">Great journalism is the courage to ask the right questions.</p><footer className="mt-4 text-sm font-bold uppercase tracking-widest text-white/60">Editorial Desk</footer></blockquote>
        </div>
        <div className="relative flex flex-1 items-center justify-center px-5 md:px-16">
          <Link className="absolute left-5 top-8 font-display text-2xl font-bold uppercase tracking-tight text-primary md:hidden" to="/">CHRONICLE</Link>
          <div className="w-full max-w-md">
            <h2 className="font-display text-4xl font-bold text-primary">{isLogin ? 'Welcome Back' : 'Create your account'}</h2>
            <p className="mt-2 text-slate-600">{isLogin ? 'Sign in to your editorial portal to continue your work.' : 'Join the Chronicle editorial workspace.'}</p>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Full Name</span>
                  <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-secondary" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Johnathan Doe" />
                </label>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Email Address</span>
                <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-secondary" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="editor@chronicle.com" type="email" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Password</span>
                <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-secondary" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" type="password" />
              </label>
              {!isLogin && (
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Confirm Password</span>
                  <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-secondary" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="••••••••" type="password" />
                </label>
              )}
              {isLogin && <label className="flex items-center gap-3 text-slate-600"><input className="h-5 w-5 rounded border-slate-300 accent-blue-600" type="checkbox" /> Stay signed in for 30 days</label>}
              {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-5 font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting} type="submit">
                {submitting ? 'Signing In...' : isLogin ? 'Sign In To Portal' : 'Create Account'} <Icon name="arrow_forward" />
              </button>
            </form>
            <p className="mt-8 text-center text-slate-600">{isLogin ? "Don't have an editorial account?" : 'Already have an account?'} <Link className="font-bold text-secondary hover:underline" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Register here' : 'Sign in'}</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
