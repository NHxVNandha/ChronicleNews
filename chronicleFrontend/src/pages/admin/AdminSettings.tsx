import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AdminPageHeader, AdminPanel, AdminSectionHeader, AdminStatCard } from '../../components/admin';
import { Icon } from '../../components/ui';
import { toast } from 'sonner';
import { z } from 'zod';
import { useTeamAccess } from '../../hooks/admin/useTeamAccess';
import { SkeletonBlock, SkeletonLine } from '../../components/Skeleton';
import { AdminLayout } from '../../layouts/AdminLayout';
import { updateUserRole, updateUserStatus } from '../../services';

type RoleName = 'Admin' | 'Editor' | 'Author' | 'Reviewer';

const teamAccessRoles: { role: RoleName; users: number; description: string; tone: string }[] = [
  { role: 'Admin', users: 3, description: 'Full workspace control, billing, settings, and role management.', tone: 'bg-primary text-white' },
  { role: 'Editor', users: 8, description: 'Can review, edit, schedule, publish, and manage editorial workflow.', tone: 'bg-secondary text-white' },
  { role: 'Author', users: 24, description: 'Can create drafts, upload article assets, and submit stories for review.', tone: 'bg-slate-700 text-white' },
  { role: 'Reviewer', users: 5, description: 'Can review assigned content, leave notes, and approve fact-check status.', tone: 'bg-slate-200 text-primary' },
];

const permissions = ['Create', 'Edit', 'Publish', 'Media', 'Settings'];

type TabName = 'general' | 'workflow' | 'team' | 'integrations';

const tabs: { id: TabName; label: string; icon: string }[] = [
  { id: 'general', label: 'General', icon: 'badge' },
  { id: 'workflow', label: 'Workflow & Publishing', icon: 'assignment' },
  { id: 'team', label: 'Team & Access', icon: 'groups' },
  { id: 'integrations', label: 'Integrations & API', icon: 'api' },
];

const settingsSchema = z.object({
  publicationName: z.string().trim().min(3, 'Publication name must be at least 3 characters.'),
  defaultLanguage: z.string().trim().min(1, 'Default language is required.'),
  timezone: z.string().trim().min(1, 'Timezone is required.'),
  editorialTagline: z.string().trim().min(5, 'Editorial tagline must be at least 5 characters.'),
  faviconUrl: z.string().trim().refine((value) => value.length === 0 || /^https?:\/\//.test(value), 'Favicon URL must start with http:// or https://.'),
  aboutSummary: z.string().trim().min(20, 'About summary must be at least 20 characters.'),
  requireEditorApproval: z.boolean(),
  enableFeaturedArticleFlag: z.boolean(),
  allowPublicComments: z.boolean(),
  sendPublishNotifications: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultSettingsValues: SettingsFormValues = {
  publicationName: 'CHRONICLE',
  defaultLanguage: 'English',
  timezone: 'Asia/Jakarta (WIB, UTC+7)',
  editorialTagline: 'Truth in Structure',
  faviconUrl: '',
  aboutSummary: 'Independent journalism for the informed reader. We deliver depth over noise, and clarity over clicks.',
  requireEditorApproval: true,
  enableFeaturedArticleFlag: true,
  allowPublicComments: false,
  sendPublishNotifications: false,
};

export function AdminSettings() {
  const { availableRoles, teamMembers, setTeamMembers, loading, error: teamError, setError: setTeamError } = useTeamAccess();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabName>('general');
  const [permissionMatrix, setPermissionMatrix] = useState<Record<RoleName, boolean[]>>({ Admin: [true, true, true, true, true], Editor: [true, true, true, true, false], Author: [true, true, false, true, false], Reviewer: [false, true, false, false, false] });
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettingsValues,
  });

  const formValues = watch();

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ memberId, fullName, roleId }: { memberId: string; fullName: string; roleId: string }) => updateUserRole(memberId, { fullName, roleId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['team', 'access'] });
      toast.success('Role updated.');
    },
    onError: (updateError) => {
      const message = updateError instanceof Error ? updateError.message : 'Failed to update user role.';
      setTeamError(message);
      toast.error(message);
    },
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ memberId, status }: { memberId: string; status: 'Active' | 'Disabled' }) => updateUserStatus(memberId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['team', 'access'] });
      toast.success('Status updated.');
    },
    onError: (updateError) => {
      const message = updateError instanceof Error ? updateError.message : 'Failed to update user status.';
      setTeamError(message);
      toast.error(message);
    },
  });

  const publishingRules = [
    { label: 'Require editor approval', key: 'requireEditorApproval' as const, enabled: formValues.requireEditorApproval },
    { label: 'Enable featured article flag', key: 'enableFeaturedArticleFlag' as const, enabled: formValues.enableFeaturedArticleFlag },
    { label: 'Allow public comments', key: 'allowPublicComments' as const, enabled: formValues.allowPublicComments },
    { label: 'Send publish notifications', key: 'sendPublishNotifications' as const, enabled: formValues.sendPublishNotifications },
  ];

  function togglePermission(role: RoleName, permissionIndex: number) {
    setPermissionMatrix((current) => ({ ...current, [role]: current[role].map((enabled, index) => index === permissionIndex ? !enabled : enabled) }));
  }

  async function updateMemberRole(memberId: string, role: RoleName) {
    const member = teamMembers.find((item) => item.id === memberId);
    const roleRecord = availableRoles.find((item) => item.name === role);
    if (!member || !roleRecord) return;

    setTeamMembers((current) => current.map((item) => item.id === memberId ? { ...item, role, roleId: roleRecord.id } : item));

    await updateUserRoleMutation.mutateAsync({ memberId, fullName: member.name, roleId: roleRecord.id });
  }

  async function toggleMemberStatus(memberId: string) {
    const member = teamMembers.find((item) => item.id === memberId);
    if (!member) return;
    const nextStatus = member.status === 'Disabled' ? 'Active' : 'Disabled';

    setTeamMembers((current) => current.map((item) => item.id === memberId ? { ...item, status: nextStatus } : item));

    await updateUserStatusMutation.mutateAsync({ memberId, status: nextStatus });
  }

  const roleCounts = teamAccessRoles.map((role) => ({ ...role, users: teamMembers.filter((member) => member.role === role.role).length || role.users }));
  const enabledRuleCount = publishingRules.filter((rule) => rule.enabled).length;

  const handleSaveGeneral = handleSubmit(() => {
    toast.success('Workspace profile updated.');
  });

  if (loading) {
    return (
      <AdminLayout title="Workspace Settings">
        <div className="space-y-8">
          <div className="space-y-2">
            <SkeletonLine width="300px" />
            <SkeletonLine width="480px" />
          </div>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <SkeletonBlock className="h-[380px]" />
              <SkeletonBlock className="h-[420px]" />
              <SkeletonBlock className="h-[260px]" />
              <SkeletonBlock className="h-[260px]" />
            </div>
            <div className="space-y-6">
              <SkeletonBlock className="h-[320px]" />
              <SkeletonBlock className="h-[200px]" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Workspace Settings">
      <div className="space-y-8 lg:space-y-10">
      <div>
        <AdminPageHeader
          eyebrow="Workspace Controls"
          title="Workspace Settings"
          description="Configure editorial identity, publishing workflow, team roles, permissions, and integrations."
        />
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1.5">
        {tabs.map((tab) => (
          <button key={tab.id} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-5 py-3 text-sm font-bold transition hover:-translate-y-px ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-primary'}`} type="button" onClick={() => setActiveTab(tab.id)}>
            <Icon name={tab.icon} className="text-base" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div>
        <AdminPanel>
          <div className="mb-6 flex items-center gap-6">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-primary text-3xl font-bold text-white">C</div>
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold text-primary">Publication Profile</h3>
              <p className="text-sm text-slate-600">Name, tagline, language, and timezone settings for the editorial workspace.</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">Live</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <label className="block lg:col-span-2"><span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Publication Name</span><input className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:border-secondary" {...register('publicationName')} />{errors.publicationName && <p className="mt-2 text-sm font-semibold text-red-600">{errors.publicationName.message}</p>}</label>
            <label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Default Language</span><select className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:border-secondary" {...register('defaultLanguage')}><option>English</option><option>Indonesian</option></select>{errors.defaultLanguage && <p className="mt-2 text-sm font-semibold text-red-600">{errors.defaultLanguage.message}</p>}</label>
            <label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Timezone</span><select className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:border-secondary" {...register('timezone')}><option>Asia/Jakarta (WIB, UTC+7)</option><option>Asia/Makassar (WITA, UTC+8)</option><option>Asia/Jayapura (WIT, UTC+9)</option><option>UTC</option></select>{errors.timezone && <p className="mt-2 text-sm font-semibold text-red-600">{errors.timezone.message}</p>}</label>
            <label className="block lg:col-span-2"><span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Editorial Tagline</span><input className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:border-secondary" {...register('editorialTagline')} />{errors.editorialTagline && <p className="mt-2 text-sm font-semibold text-red-600">{errors.editorialTagline.message}</p>}</label>
            <label className="block lg:col-span-2"><span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Favicon URL</span><input className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:border-secondary" placeholder="https://chronicle.news/favicon.ico" {...register('faviconUrl')} />{errors.faviconUrl && <p className="mt-2 text-sm font-semibold text-red-600">{errors.faviconUrl.message}</p>}</label>
            <label className="block lg:col-span-3"><span className="mb-2 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-slate-600"><span>About Summary</span><span className="text-xs font-normal text-slate-400">Shown on /about page</span></span><textarea className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:border-secondary" rows={4} {...register('aboutSummary')} />{errors.aboutSummary && <p className="mt-2 text-sm font-semibold text-red-600">{errors.aboutSummary.message}</p>}</label>
          </div>
          <div className="mt-6 flex items-center justify-between rounded-xl bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <Icon name="info" className="text-secondary" />
              <p className="text-sm text-slate-600">Changes to publication name and tagline apply globally across the site.</p>
            </div>
            <button className="rounded-lg bg-primary px-6 py-3 font-bold !text-white" type="button" onClick={() => void handleSaveGeneral()}>Save Changes</button>
          </div>
        </AdminPanel>
        </div>
      )}

      {activeTab === 'workflow' && (
        <div>
        <AdminPanel>
          <AdminSectionHeader title="Publishing Rules" description="Toggle editorial gates and automated publishing behaviors." meta={<span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-secondary">{enabledRuleCount} / {publishingRules.length} active</span>} bordered={false} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {publishingRules.map((rule) => (
              <button key={rule.label} className={`flex items-center justify-between rounded-xl border p-5 text-left transition hover:-translate-y-[2px] ${rule.enabled ? 'border-secondary bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`} type="button" onClick={() => setValue(rule.key, !rule.enabled, { shouldDirty: true })}>
                <span className="font-semibold text-slate-700">{rule.label}</span>
                <span className={`h-7 w-12 rounded-full p-1 transition ${rule.enabled ? 'bg-secondary' : 'bg-slate-300'}`}>
                  <span className={`block h-5 w-5 rounded-full bg-white shadow transition ${rule.enabled ? 'translate-x-5' : ''}`} />
                </span>
              </button>
            ))}
          </div>
        </AdminPanel>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-6">
          {teamError && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{teamError}</div>}
          <AdminPanel action={<button className="flex w-fit items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold !text-white shadow-lg shadow-blue-950/20" type="button"><Icon name="person_add" className="text-[18px]" /> Invite User</button>}>
            <AdminSectionHeader title="Team Access Management" description="Define role capacity, granular permissions, and assign members." bordered={false} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {roleCounts.map((item) => (
                <div key={item.role}>
                  <AdminStatCard label={item.role} value={item.users} helper={item.description} tone={item.role === 'Admin' ? 'blue' : item.role === 'Editor' ? 'amber' : 'default'} />
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Permission Matrix" description="Toggle capabilities available to each role." className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Role</th>
                    {permissions.map((permission) => <th key={permission} className="px-5 py-4 text-center">{permission}</th>)}
                    <th className="px-5 py-4 text-center">Capacity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {roleCounts.map((item) => (
                    <tr key={item.role}>
                      <td className="px-5 py-4 font-bold text-primary">{item.role}</td>
                      {permissionMatrix[item.role].map((enabled, index) => (
                        <td key={permissions[index]} className="px-5 py-4 text-center">
                          <button className={`inline-flex h-7 w-12 rounded-full p-1 transition ${enabled ? 'bg-secondary' : 'bg-slate-300'}`} type="button" onClick={() => togglePermission(item.role, index)} aria-label={`Toggle ${permissions[index]} for ${item.role}`}>
                            <span className={`h-5 w-5 rounded-full bg-white shadow transition ${enabled ? 'translate-x-5' : ''}`} />
                          </button>
                        </td>
                      ))}
                      <td className="px-5 py-4 text-center">
                        <span className="font-bold text-slate-700">{item.users}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>

          <AdminPanel title="Team Members" description="Assign members into Admin, Editor, Author, or Reviewer access." action={<button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700" type="button">Manage Invites</button>} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Member</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                   {teamMembers.map((member) => (
                     <tr key={member.id}>
                       <td className="px-5 py-4 font-bold text-primary">{member.name}</td>
                       <td className="px-5 py-4 text-slate-600">{member.email}</td>
                       <td className="px-5 py-4">
                         <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-secondary" value={member.role} onChange={(event) => void updateMemberRole(member.id, event.target.value as RoleName)}>
                           {teamAccessRoles.map((item) => <option key={item.role}>{item.role}</option>)}
                         </select>
                       </td>
                       <td className="px-5 py-4">
                         <span className={`rounded-full px-3 py-1 text-xs font-bold ${member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : member.status === 'Invited' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>{member.status}</span>
                       </td>
                       <td className="px-5 py-4 text-right">
                         <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-secondary" type="button"><Icon name="edit" /></button>
                         <button className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600" type="button" onClick={() => void toggleMemberStatus(member.id)}><Icon name="person_remove" /></button>
                       </td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <section className="grid gap-6 lg:grid-cols-2">
            <AdminPanel title="API Keys">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-700">Production Key</p>
                    <p className="font-mono text-sm text-slate-500">cms_prod_••••••••••••a3f8</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-700">Staging Key</p>
                    <p className="font-mono text-sm text-slate-500">cms_stg_••••••••••••b2c1</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Expiring</span>
                </div>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white py-3 font-bold text-primary transition hover:border-secondary" type="button"><Icon name="add" /> Generate New Key</button>
            </AdminPanel>
            <AdminPanel title="Webhooks">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-700">Content Published</p>
                    <p className="truncate font-mono text-sm text-slate-500">https://hook.chronicle.press/publish</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">200 OK</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-700">Content Deleted</p>
                    <p className="truncate font-mono text-sm text-slate-500">https://hook.chronicle.press/delete</p>
                  </div>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">Not set</span>
                </div>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white py-3 font-bold text-primary transition hover:border-secondary" type="button"><Icon name="add" /> Add Webhook</button>
            </AdminPanel>
          </section>

          <AdminPanel>
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500"><Icon name="cloud_download" /></span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-primary">Data Export & Backup</h3>
                <p className="text-sm text-slate-600">Export all content, media, and settings as a portable archive.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="rounded-lg bg-primary px-5 py-3 font-bold !text-white" type="button"><Icon name="download" className="mr-2 align-middle" />Export All Content</button>
                  <button className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-bold text-slate-600" type="button"><Icon name="schedule" className="mr-2 align-middle" />Schedule Auto-backup</button>
                  <button className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-bold text-red-600" type="button"><Icon name="delete_forever" className="mr-2 align-middle" />Reset Workspace</button>
                </div>
              </div>
            </div>
          </AdminPanel>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
