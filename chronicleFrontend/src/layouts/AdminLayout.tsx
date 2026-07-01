import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AdminCommandPalette } from '../components/admin';
import { adminItems, adminProfileImage } from '../config/navigation';
import { Avatar, Icon } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getArticles } from '../services';

type CommandArticle = {
  slug: string;
  title: string;
  status: string;
  category?: string;
};

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandArticles, setCommandArticles] = useState<CommandArticle[]>([]);
  const [isLoadingCommandArticles, setIsLoadingCommandArticles] = useState(false);
  const [hasLoadedCommandArticles, setHasLoadedCommandArticles] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: '1', text: '3 articles need review', unread: true },
    { id: '2', text: 'Media upload completed', unread: true },
    { id: '3', text: 'Scheduled publish at 18:00', unread: true },
  ]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  async function handleSignOut() {
    setShowProfileMenu(false);
    await logout();
    navigate('/login', { replace: true });
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  function toggleNotifications() {
    setShowNotifications((prev) => {
      if (!prev) {
        setShowProfileMenu(false);
      }

      return !prev;
    });
  }

  function toggleProfileMenu() {
    setShowProfileMenu((prev) => {
      if (!prev) {
        setShowNotifications(false);
      }

      return !prev;
    });
  }

  function closeMenus() {
    setShowNotifications(false);
    setShowProfileMenu(false);
  }

  function openCommandPalette() {
    closeMenus();
    setIsOpen(false);
    setIsCommandOpen(true);
  }

  function handleCommandNavigate(path: string) {
    closeMenus();
    setIsOpen(false);
    setIsCommandOpen(false);
    navigate(path);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingTarget = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (isTypingTarget) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isCommandOpen) {
          setIsCommandOpen(false);
          return;
        }

        openCommandPalette();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCommandOpen]);

  useEffect(() => {
    if (!isCommandOpen || hasLoadedCommandArticles) {
      return;
    }

    let isMounted = true;

    async function loadCommandArticles() {
      try {
        setIsLoadingCommandArticles(true);
        const result = await getArticles({ limit: 12 });
        if (!isMounted) {
          return;
        }

        setCommandArticles(result.map((article) => ({
          slug: article.slug,
          title: article.title,
          status: article.status,
          category: article.category,
        })));
        setHasLoadedCommandArticles(true);
      } finally {
        if (isMounted) {
          setIsLoadingCommandArticles(false);
        }
      }
    }

    void loadCommandArticles();

    return () => {
      isMounted = false;
    };
  }, [hasLoadedCommandArticles, isCommandOpen]);

  return (
    <div className="admin-shell bg-[#f5f7fb] text-slate-700">
      <aside className="admin-sidebar bg-slate-950 text-slate-300">
        <div className="mb-10 space-y-2 px-2">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">CHRONICLE</h1>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Editorial Desk</p>
        </div>
        <nav className="space-y-1.5">
          {adminItems.map((item) => (
            <NavLink key={item.to} end={item.to === '/admin'} to={item.to} className={({ isActive }) => `admin-link flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition duration-200 ${isActive ? 'active !text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              {({ isActive }) => (
                <>
                  <span className={`grid h-9 w-9 place-items-center rounded-xl transition ${isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-300'}`}><Icon name={item.icon} className="text-[20px]" /></span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="mt-10 border-t border-white/10 pt-6">
          <Link to="/admin/articles/new" className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 text-sm font-bold tracking-wide !text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-600"><Icon name="add" className="text-[20px]" /> Create New Post</Link>
        </div>
      </aside>
      <main className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden" onClick={() => setIsOpen(true)} type="button" aria-label="Open admin navigation"><Icon name="menu" className="text-[20px]" /></button>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Admin Workspace</p>
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
            <label className="relative hidden md:block">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400" />
              <input className="w-72 rounded-xl border border-transparent bg-slate-100 px-4 py-2.5 pl-10 text-sm outline-none transition focus:border-slate-300 focus:bg-white" data-testid="admin-command-trigger" placeholder="Quick search..." readOnly onClick={openCommandPalette} onFocus={(event) => { event.currentTarget.blur(); openCommandPalette(); }} />
            </label>
            <div className="relative">
              <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" type="button" onClick={toggleNotifications}><Icon name="notifications" className="text-[20px]" />{unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-4 ring-white">{unreadCount}</span>}</button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10"
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3"><h3 className="font-bold text-slate-950">Notifications</h3><button className="text-xs font-bold text-secondary hover:underline" type="button" onClick={markAllRead}>{unreadCount > 0 ? 'Mark all read' : 'All read'}</button></div>
                    <div className="space-y-2">{notifications.map((item) => <motion.div key={item.id} className={`flex cursor-pointer items-center justify-between rounded-xl p-3 text-sm font-semibold transition ${item.unread ? 'bg-blue-50 text-slate-800' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`} onClick={() => markRead(item.id)} role="button" tabIndex={0} onKeyDown={() => markRead(item.id)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16, ease: 'easeOut' }}><span>{item.text}</span>{item.unread && <span className="h-2 w-2 rounded-full bg-secondary" />}</motion.div>)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative hidden items-center gap-2 sm:flex">
              <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition hover:bg-slate-50" onClick={toggleProfileMenu} type="button"><Avatar src={adminProfileImage} alt="Senior editor profile" /><span className="text-sm font-semibold text-slate-700">Editor Profile</span><motion.span animate={{ rotate: showProfileMenu ? 180 : 0 }} transition={{ duration: 0.18, ease: 'easeOut' }}><Icon name="expand_more" className="text-base text-slate-400" /></motion.span></button>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10"
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <div className="border-b border-slate-100 px-3 pb-3 pt-2"><p className="font-bold text-slate-950">Julian Thorne</p><p className="text-sm text-slate-500">Senior Editorial Manager</p></div>
                    <div className="mt-2 space-y-1">
                      <Link className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" to="/admin/profile" onClick={closeMenus}>Profile<Icon name="chevron_right" className="text-base" /></Link>
                      <Link className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" to="/admin/settings" onClick={closeMenus}>Account Settings<Icon name="chevron_right" className="text-base" /></Link>
                      <Link className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" to="/admin/settings" onClick={closeMenus}>Editorial Preferences<Icon name="chevron_right" className="text-base" /></Link>
                      <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-50" onClick={() => void handleSignOut()} type="button">Sign Out<Icon name="chevron_right" className="text-base" /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="sm:hidden"><Avatar src={adminProfileImage} alt="Senior editor profile" /></div>
          </div>
          </div>
        </header>
        <AnimatePresence>
          {(showNotifications || showProfileMenu) && <motion.div className="fixed inset-0 z-20" onClick={closeMenus} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
        </AnimatePresence>
        <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.aside className="flex h-full w-[86vw] max-w-sm flex-col bg-slate-950 p-6 text-slate-300 shadow-2xl" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.22, ease: 'easeOut' }}>
              <div className="mb-8 flex items-center justify-between"><div><h1 className="font-display text-3xl font-bold text-white">CHRONICLE</h1><p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Editorial Desk</p></div><button className="rounded-xl border border-white/10 bg-white/5 p-2 text-white" onClick={() => setIsOpen(false)} type="button" aria-label="Close admin navigation"><Icon name="close" className="text-[20px]" /></button></div>
              <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
                {adminItems.map((item) => <NavLink key={item.to} end={item.to === '/admin'} to={item.to} onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${isActive ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><span className={`grid h-9 w-9 place-items-center rounded-xl ${item.to === '/admin' ? 'bg-white/5' : 'bg-white/5'}`}><Icon name={item.icon} className="text-[20px]" /></span>{item.label}</NavLink>)}
              </nav>
              <Link to="/admin/articles/new" onClick={() => setIsOpen(false)} className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 text-sm font-bold !text-white shadow-lg shadow-blue-950/20"><Icon name="add" className="text-[20px]" /> Create New Post</Link>
            </motion.aside>
          </motion.div>
        )}
        </AnimatePresence>
        <AdminCommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} articles={commandArticles} isLoadingArticles={isLoadingCommandArticles} onNavigate={handleCommandNavigate} />
        <div className="p-6 lg:p-10 xl:p-12">{children}</div>
      </main>
    </div>
  );
}
