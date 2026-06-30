import type { ReactNode } from 'react';

type AdminSectionHeaderProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  meta?: ReactNode;
  action?: ReactNode;
  bordered?: boolean;
};

export function AdminSectionHeader({ icon, title, description, meta, action, bordered = true }: AdminSectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 ${bordered ? 'border-b border-slate-200 pb-4' : ''} lg:flex-row lg:items-start lg:justify-between`}>
      <div className="flex items-start gap-3">
        {icon && <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700">{icon}</div>}
        <div>
          <h3 className="text-xl font-bold text-slate-950">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {(meta || action) && <div className="flex items-center gap-2">{meta}{action}</div>}
    </div>
  );
}
