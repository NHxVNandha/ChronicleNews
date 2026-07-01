import type { ReactNode } from 'react';

type AdminPanelProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: 'default' | 'subtle' | 'accent' | 'dark';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  contentClassName?: string;
};

const toneClasses: Record<NonNullable<AdminPanelProps['tone']>, string> = {
  default: 'border border-slate-200 bg-white shadow-sm',
  subtle: 'border border-slate-200 bg-slate-50 shadow-none',
  accent: 'border border-blue-100 bg-blue-50 shadow-sm',
  dark: 'border border-slate-900 bg-slate-950 text-white shadow-lg shadow-slate-950/10',
};

const paddingClasses: Record<NonNullable<AdminPanelProps['padding']>, string> = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function AdminPanel({ title, description, action, children, tone = 'default', padding = 'lg', className = '', contentClassName = '' }: AdminPanelProps) {
  const headerBorder = tone === 'dark' ? 'border-white/10' : 'border-slate-200';
  const hasHeader = title || description || action;

  return (
    <section className={`rounded-2xl ${toneClasses[tone]} ${className}`}>
      {hasHeader && (
        <div className={`mb-5 border-b ${headerBorder} ${paddingClasses[padding]} pb-4`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              {title && <h3 className={`text-xl font-bold ${tone === 'dark' ? 'text-white' : 'text-slate-950'}`}>{title}</h3>}
              {description && <p className={`mt-1 text-sm ${tone === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>}
            </div>
            {action && <div className="flex items-center gap-2">{action}</div>}
          </div>
        </div>
      )}
      <div className={`${hasHeader ? 'px-6 pb-6' : paddingClasses[padding]} ${contentClassName}`}>{children}</div>
    </section>
  );
}
