import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  compact?: boolean;
};

export function AdminPageHeader({ eyebrow, title, description, actions, compact = false }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/90 pb-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl space-y-2">
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>}
        <h1 className={`${compact ? 'text-3xl lg:text-4xl' : 'text-4xl lg:text-5xl'} font-display font-bold tracking-tight text-slate-950`}>{title}</h1>
        {description && <p className={`${compact ? 'text-sm leading-6' : 'text-base leading-7'} text-slate-600`}>{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
