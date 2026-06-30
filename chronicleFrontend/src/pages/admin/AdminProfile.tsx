import { AdminPageHeader, AdminPanel } from '../../components/admin';
import { Avatar, Field } from '../../components/ui';
import { adminProfileImage } from '../../config/navigation';
import { AdminLayout } from '../../layouts/AdminLayout';

export function AdminProfile() {
  return (
    <AdminLayout title="Editor Profile">
      <div className="space-y-8 lg:space-y-10">
        <AdminPageHeader
          eyebrow="Profile Settings"
          title="Editor Profile"
          description="Manage your editorial identity, contact details, and workspace profile information."
        />
        <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
          <AdminPanel className="text-center"><div className="mx-auto w-fit"><Avatar src={adminProfileImage} alt="Julian Thorne" size="h-32 w-32" /></div><h1 className="font-display mt-5 text-3xl font-bold text-primary">Julian Thorne</h1><p className="mt-1 text-slate-600">Senior Editorial Manager</p><button className="mt-6 w-full rounded-xl bg-secondary py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/20">Upload Avatar</button></AdminPanel>
          <AdminPanel title="Account Details"><div className="grid gap-4 md:grid-cols-2"><Field label="Full Name" placeholder="Julian Thorne" icon="badge" /><Field label="Email" placeholder="julian@chronicle.press" icon="mail" type="email" /></div><div className="mt-4"><Field label="Role" placeholder="Senior Editorial Manager" icon="workspace_premium" /></div><label className="mt-4 block"><span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Bio</span><textarea className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-secondary" rows={5} defaultValue="Leads Chronicle's editorial workflow, review standards, and cross-desk publishing operations." /></label><div className="mt-6"><button className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10">Save Profile</button></div></AdminPanel>
        </div>
      </div>
    </AdminLayout>
  );
}
