import { Icon } from '../../components/ui';
import { AdminLayout } from '../../layouts/AdminLayout';

export function AdminMonetizationHub() {
  return (
    <AdminLayout title="Ads Management">
      <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow"><div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h1 className="font-display text-4xl font-bold text-primary">Ads & Sponsorship Slots</h1><p className="mt-2 text-slate-600">Kelola inventori iklan display, native sponsorship, dan posisi promosi.</p></div><button className="rounded-lg bg-primary px-5 py-3 font-bold text-white">New Placement</button></div><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500"><tr><th className="px-5 py-4">Placement</th><th className="px-5 py-4">Size</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-200">{['Homepage Leaderboard', 'Article Inline', 'Sidebar Native', 'Newsletter Sponsor'].map((item, index) => <tr key={item}><td className="px-5 py-4 font-bold text-primary">{item}</td><td className="px-5 py-4 text-slate-600">{index === 0 ? '970x250' : index === 1 ? '728x90' : 'Native'}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Active</span></td><td className="px-5 py-4 text-right"><button className="p-2 text-slate-500 hover:text-secondary"><Icon name="edit" /></button></td></tr>)}</tbody></table></div></section>
    </AdminLayout>
  );
}
