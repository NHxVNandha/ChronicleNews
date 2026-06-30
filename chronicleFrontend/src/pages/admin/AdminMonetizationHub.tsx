import { AdminPageHeader, AdminPanel, AdminStatusBadge } from '../../components/admin';
import { Icon } from '../../components/ui';
import { AdminLayout } from '../../layouts/AdminLayout';

export function AdminMonetizationHub() {
  return (
    <AdminLayout title="Ads Management">
      <div className="space-y-8 lg:space-y-10">
        <AdminPageHeader
          eyebrow="Revenue Operations"
          title="Ads & Sponsorship Slots"
          description="Kelola inventori iklan display, native sponsorship, dan posisi promosi."
          actions={<button className="rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/20">New Placement</button>}
        />
        <AdminPanel>
          <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500"><tr><th className="px-5 py-4">Placement</th><th className="px-5 py-4">Size</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-200">{['Homepage Leaderboard', 'Article Inline', 'Sidebar Native', 'Newsletter Sponsor'].map((item, index) => <tr key={item}><td className="px-5 py-4 font-bold text-primary">{item}</td><td className="px-5 py-4 text-slate-600">{index === 0 ? '970x250' : index === 1 ? '728x90' : 'Native'}</td><td className="px-5 py-4"><AdminStatusBadge status="approved">Active</AdminStatusBadge></td><td className="px-5 py-4 text-right"><button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-secondary"><Icon name="edit" /></button></td></tr>)}</tbody></table></div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
}
