import { Icon } from '../../components/ui';
import { AdminLayout } from '../../layouts/AdminLayout';

export function AdminActivity() {
  const events = ['Published a homepage feature', 'Updated Technology category metadata', 'Approved media upload batch', 'Invited a reviewer', 'Scheduled tomorrow briefing'];

  return (
    <AdminLayout title="Activity Log">
      <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
        <h1 className="font-display text-4xl font-bold text-primary">Workspace Activity</h1>
        <p className="mt-2 text-slate-600">Recent editorial, media, and access-management changes.</p>
        <div className="mt-8 space-y-4">{events.map((event, index) => <div key={event} className="flex gap-4 rounded-xl bg-slate-50 p-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white"><Icon name={index % 2 ? 'edit' : 'publish'} /></span><div><p className="font-bold text-primary">{event}</p><p className="text-sm text-slate-500">Julian Thorne · {index + 1}h ago · IP 192.168.0.{index + 12}</p></div></div>)}</div>
      </section>
    </AdminLayout>
  );
}
