import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { adminItems, adminProfileImage } from '../config/navigation';
import { Avatar, Icon } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
    await logout();
    navigate('/login', { replace: true });
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="admin-shell bg-slate-50">
      <aside className="admin-sidebar">
        <div className="mb-10 px-2"><h1 className="font-display text-3xl font-bold text-primary">CHRONICLE</h1><p className="mt-1 text-xs uppercase tracking-widest text-slate-500">Editorial Desk</p></div>
        <nav className="space-y-1">
          {adminItems.map((item) => (
            <NavLink key={item.to} end={item.to === '/admin'} to={item.to} className={({ isActive }) => `admin-link flex items-center gap-3 rounded-lg px-4 py-3 font-semibold transition ${isActive ? 'active !text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-primary'}`}>
              <Icon name={item.icon} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/admin/articles/new" className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold !text-white"><Icon name="add" /> Create New Post</Link>
      </aside>
      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3"><button className="md:hidden" onClick={() => setIsOpen(true)} type="button" aria-label="Open admin navigation"><Icon name="menu" /></button><h2 className="text-xl font-bold text-primary">{title}</h2></div>
          <div className="flex items-center gap-4">
            <input className="hidden rounded-full bg-slate-100 px-4 py-2 outline-none md:block" placeholder="Quick search..." />
            <div className="relative">
              <button className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50" type="button" onClick={() => setShowNotifications((prev) => !prev)}><Icon name="notifications" />{unreadCount > 0 && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">{unreadCount}</span>}</button>
              {showNotifications && (
                <div className="absolute right-0 top-12 z-30 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between"><h3 className="font-bold text-primary">Notifications</h3><button className="text-xs font-bold text-secondary hover:underline" type="button" onClick={markAllRead}>{unreadCount > 0 ? 'Mark all read' : 'All read'}</button></div>
                  <div className="space-y-2">{notifications.map((item) => <div key={item.id} className={`flex cursor-pointer items-center justify-between rounded-lg p-3 text-sm font-semibold ${item.unread ? 'bg-blue-50 text-slate-700' : 'bg-slate-50 text-slate-500'}`} onClick={() => markRead(item.id)} role="button" tabIndex={0} onKeyDown={() => markRead(item.id)}><span>{item.text}</span>{item.unread && <span className="h-2 w-2 rounded-full bg-secondary" />}</div>)}</div>
                </div>
              )}
              {showNotifications && <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />}
            </div>
            <div className="group relative hidden items-center gap-2 sm:flex">
              <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition hover:bg-slate-50"><Avatar src={adminProfileImage} alt="Senior editor profile" /><span className="text-sm font-semibold text-slate-600">Editor Profile</span><Icon name="expand_more" className="text-base text-slate-400" /></button>
              <div className="invisible absolute right-0 top-12 z-30 w-64 rounded-xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <div className="border-b border-slate-100 p-3"><p className="font-bold text-primary">Julian Thorne</p><p className="text-sm text-slate-500">Senior Editorial Manager</p></div>
                <Link className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50" to="/admin/profile">Profile<Icon name="chevron_right" className="text-base" /></Link>
                <Link className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50" to="/admin/settings">Account Settings<Icon name="chevron_right" className="text-base" /></Link>
                <Link className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50" to="/admin/settings">Editorial Preferences<Icon name="chevron_right" className="text-base" /></Link>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={() => void handleSignOut()} type="button">Sign Out<Icon name="chevron_right" className="text-base" /></button>
              </div>
            </div>
            <div className="sm:hidden"><Avatar src={adminProfileImage} alt="Senior editor profile" /></div>
          </div>
        </header>
        {isOpen && (
          <div className="fixed inset-0 z-[90] bg-primary/60 backdrop-blur-sm md:hidden">
            <aside className="flex h-full w-[86vw] max-w-sm flex-col bg-white p-6 shadow-2xl">
              <div className="mb-8 flex items-center justify-between"><div><h1 className="font-display text-3xl font-bold text-primary">CHRONICLE</h1><p className="mt-1 text-xs uppercase tracking-widest text-slate-500">Editorial Desk</p></div><button className="rounded-lg bg-slate-100 p-2 text-primary" onClick={() => setIsOpen(false)} type="button" aria-label="Close admin navigation"><Icon name="close" /></button></div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
                {adminItems.map((item) => <NavLink key={item.to} end={item.to === '/admin'} to={item.to} onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold ${isActive ? 'bg-primary !text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-primary'}`}><Icon name={item.icon} />{item.label}</NavLink>)}
              </nav>
              <Link to="/admin/articles/new" onClick={() => setIsOpen(false)} className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold !text-white"><Icon name="add" /> Create New Post</Link>
            </aside>
          </div>
        )}
        <div className="p-6 lg:p-12">{children}</div>
      </main>
    </div>
  );
}
