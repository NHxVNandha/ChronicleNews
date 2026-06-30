import type { ReactNode } from 'react';

type AdminInfoCardProps = {
  leading?: ReactNode;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function AdminInfoCard({ leading, title, description, meta, action, className = '' }: AdminInfoCardProps) {
  return (
    <div className={`flex items-start gap-4 rounded-xl p-3 transition duration-200 hover:bg-slate-50 ${className}`}>
      {leading && <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">{leading}</div>}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {description && <div className="mt-1 text-xs text-slate-500">{description}</div>}
      </div>
      {meta && <div className="shrink-0">{meta}</div>}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
