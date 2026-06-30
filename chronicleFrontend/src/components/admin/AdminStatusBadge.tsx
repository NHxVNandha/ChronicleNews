import type { ReactNode } from 'react';

type AdminStatusBadgeProps = {
  status: 'published' | 'draft' | 'needs-review' | 'scheduled' | 'archived' | 'active' | 'invited' | 'disabled' | 'flagged' | 'pending' | 'approved' | 'hidden';
  children?: ReactNode;
};

const statusMap: Record<AdminStatusBadgeProps['status'], string> = {
  published: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-amber-100 text-amber-700',
  'needs-review': 'bg-purple-100 text-purple-700',
  scheduled: 'bg-blue-100 text-blue-700',
  archived: 'bg-slate-200 text-slate-600',
  active: 'bg-emerald-100 text-emerald-700',
  invited: 'bg-amber-100 text-amber-700',
  disabled: 'bg-slate-200 text-slate-600',
  flagged: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  hidden: 'bg-slate-100 text-slate-600',
};

export function AdminStatusBadge({ status, children }: AdminStatusBadgeProps) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${statusMap[status]}`}>{children ?? status}</span>;
}
