import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { footerLinks, navItems } from '../config/navigation';
import { Icon } from '../components/ui';

export function PublicHeader({ dark = false }: { dark?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const headerClass = dark
    ? 'sticky top-0 z-50 bg-primary text-white editorial-shadow'
    : 'sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md';

  return (
    <header className={headerClass}>
      <nav className="container-page flex items-center justify-between py-4">
        <Link to="/" className="font-display text-2xl font-bold uppercase tracking-[0.16em] text-inherit">
          CHRONICLE
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                `nav-link text-sm font-bold uppercase tracking-[0.05em] transition-colors hover:text-secondary ${
                  isActive ? 'active' : dark ? 'text-white/75' : 'text-slate-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/search" className="rounded-full p-2 transition hover:bg-slate-100 hover:text-secondary">
            <Icon name="search" />
          </Link>
          <Link
            to="/admin"
            className={`hidden rounded-lg px-5 py-2 text-sm font-bold uppercase tracking-wider transition md:inline-flex ${
              dark ? 'bg-secondary text-white hover:bg-blue-500' : 'bg-secondary text-white hover:bg-blue-600'
            }`}
          >
            Sign In
          </Link>
          <button className="rounded-lg p-2 md:hidden" aria-label="Open navigation" onClick={() => setIsOpen(true)} type="button">
            <Icon name="menu" />
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className="fixed inset-0 z-[80] bg-primary/60 backdrop-blur-sm md:hidden">
          <aside className="ml-auto flex h-full w-[86vw] max-w-sm flex-col bg-white p-6 text-primary shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/" className="font-display text-2xl font-bold uppercase tracking-[0.16em]" onClick={() => setIsOpen(false)}>CHRONICLE</Link>
              <button className="rounded-lg bg-slate-100 p-2 text-primary" onClick={() => setIsOpen(false)} type="button" aria-label="Close navigation"><Icon name="close" /></button>
            </div>
            <nav className="flex flex-1 flex-col gap-2">
              {navItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)} className={({ isActive }) => `rounded-xl px-4 py-3 font-bold ${isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'}`}>{item.label}</NavLink>)}
            </nav>
            <div className="mt-6 grid gap-3">
              <Link className="rounded-xl border border-slate-200 px-4 py-3 text-center font-bold text-primary" to="/search" onClick={() => setIsOpen(false)}>Search</Link>
              <Link className="rounded-xl bg-secondary px-4 py-3 text-center font-bold text-white" to="/admin" onClick={() => setIsOpen(false)}>Sign In</Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary px-5 py-16 text-white md:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-3">
        <div>
          <h2 className="font-display mb-6 text-3xl font-bold uppercase tracking-[0.12em]">CHRONICLE</h2>
          <p className="max-w-sm text-white/70">
            Built for the pursuit of absolute journalistic clarity. Independent, accurate, and essential news for the modern era.
          </p>
          <div className="mt-8 flex gap-3">
            {['public', 'alternate_email', 'rss_feed'].map((icon) => (
              <a key={icon} className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:border-secondary hover:bg-secondary" href="#social">
                <Icon name={icon} />
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="border-b border-white/10 pb-4 text-sm font-bold uppercase tracking-widest">Information</h3>
          {footerLinks.map((item) => (
            <Link key={item.to} className="text-white/70 transition hover:text-white" to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <h3 className="mb-6 border-b border-white/10 pb-4 text-sm font-bold uppercase tracking-widest">Newsletter</h3>
          <div className="flex gap-2">
            <input className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 p-3 text-white outline-none placeholder:text-white/35 focus:border-secondary" placeholder="Your Email" />
            <button className="rounded-lg bg-secondary px-6 font-bold uppercase tracking-wider text-white">Go</button>
          </div>
          <p className="mt-12 text-xs uppercase tracking-widest text-white/40">© 2024 Chronicle News Media.</p>
        </div>
      </div>
    </footer>
  );
}

export function MinimalFooter({ text = 'Independent journalism for the informed reader. We deliver depth over noise, and clarity over clicks.' }: { text?: string }) {
  return (
    <footer className="grid w-full grid-cols-1 gap-8 border-t-4 border-primary bg-primary px-6 py-16 text-white md:grid-cols-3">
      <div>
        <h2 className="font-display mb-6 text-3xl font-bold uppercase tracking-tight">CHRONICLE</h2>
        <p className="max-w-xs text-white/70">{text}</p>
      </div>
      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-blue-200">Navigation</h3>
        <ul className="space-y-4 text-white/80">
          {footerLinks.map((item) => (
            <li key={item.to}><Link className="transition hover:text-blue-200" to={item.to}>{item.label}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-blue-200">Connect</h3>
        <div className="mb-8 flex gap-4">
          {['public', 'chat_bubble', 'rss_feed'].map((icon) => (
            <a key={icon} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-secondary" href="#footer"><Icon name={icon} /></a>
          ))}
        </div>
        <p className="text-sm text-white/50">© 2024 Chronicle News Media. Built for truth.</p>
      </div>
    </footer>
  );
}
