import { Avatar, Field } from '../../components/ui';
import { adminProfileImage } from '../../config/navigation';
import { AdminLayout } from '../../layouts/AdminLayout';

export function AdminProfile() {
  return (
    <AdminLayout title="Editor Profile">
      <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-slate-200 bg-white p-6 text-center soft-shadow"><div className="mx-auto w-fit"><Avatar src={adminProfileImage} alt="Julian Thorne" size="h-32 w-32" /></div><h1 className="font-display mt-5 text-3xl font-bold text-primary">Julian Thorne</h1><p className="mt-1 text-slate-600">Senior Editorial Manager</p><button className="mt-6 w-full rounded-lg bg-primary py-3 font-bold text-white">Upload Avatar</button></aside>
        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 soft-shadow"><h2 className="text-xl font-bold text-primary">Account Details</h2><div className="grid gap-4 md:grid-cols-2"><Field label="Full Name" placeholder="Julian Thorne" icon="badge" /><Field label="Email" placeholder="julian@chronicle.press" icon="mail" type="email" /></div><Field label="Role" placeholder="Senior Editorial Manager" icon="workspace_premium" /><label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Bio</span><textarea className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 outline-none focus:border-secondary" rows={5} defaultValue="Leads Chronicle's editorial workflow, review standards, and cross-desk publishing operations." /></label><button className="rounded-lg bg-secondary px-6 py-3 font-bold text-white">Save Profile</button></section>
      </div>
    </AdminLayout>
  );
}
