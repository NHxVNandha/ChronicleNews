import { Link } from 'react-router-dom';
import { Field, Icon } from '../../components/ui';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login';

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
            <form className="mt-8 space-y-5">
              {!isLogin && <Field label="Full Name" placeholder="Johnathan Doe" icon="badge" />}
              <Field label="Email Address" placeholder="editor@chronicle.com" icon="person" type="email" />
              <Field label="Password" placeholder="••••••••" icon="lock" type="password" />
              {!isLogin && <Field label="Confirm Password" placeholder="••••••••" icon="lock_reset" type="password" />}
              {isLogin && <label className="flex items-center gap-3 text-slate-600"><input className="h-5 w-5 rounded border-slate-300 accent-blue-600" type="checkbox" /> Stay signed in for 30 days</label>}
              <Link className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-5 font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-blue-700" to="/admin">
                {isLogin ? 'Sign In To Portal' : 'Create Account'} <Icon name="arrow_forward" />
              </Link>
            </form>
            <p className="mt-8 text-center text-slate-600">{isLogin ? "Don't have an editorial account?" : 'Already have an account?'} <Link className="font-bold text-secondary hover:underline" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Register here' : 'Sign in'}</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
