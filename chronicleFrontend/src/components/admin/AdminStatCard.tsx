import { Icon } from '../ui';

type AdminStatCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  helper?: string;
  icon?: string;
  variant?: 'primary' | 'compact' | 'alert';
  tone?: 'default' | 'blue' | 'emerald' | 'amber' | 'red';
  className?: string;
};

const toneMap = {
  default: 'bg-white border-slate-200 text-slate-950 shadow-sm hover:shadow-md',
  blue: 'bg-slate-950 border-slate-900 text-white shadow-lg shadow-slate-950/10 hover:shadow-xl hover:shadow-slate-950/10',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-sm hover:shadow-md',
  amber: 'bg-amber-50 border-amber-200 text-amber-950 shadow-sm hover:shadow-md',
  red: 'bg-red-50 border-red-200 text-red-950 shadow-sm hover:shadow-md',
} as const;

export function AdminStatCard({ label, value, delta, helper, icon, variant = 'compact', tone = 'default', className = '' }: AdminStatCardProps) {
  return (
    <div className={`rounded-2xl border p-5 transition duration-200 hover:-translate-y-0.5 ${toneMap[tone]} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className={`${variant === 'primary' ? 'text-4xl' : 'text-3xl'} font-display mt-2 font-bold ${tone === 'blue' ? 'text-white' : 'text-slate-950'}`}>{value}</p>
        </div>
        {icon && <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone === 'blue' ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}><Icon name={icon} className="text-[20px]" /></div>}
      </div>
      {delta && <p className={`mt-3 text-sm font-semibold ${tone === 'blue' ? 'text-slate-300' : 'text-secondary'}`}>{delta}</p>}
      {helper && <p className={`mt-1 text-sm ${tone === 'blue' ? 'text-slate-400' : 'text-slate-500'}`}>{helper}</p>}
    </div>
  );
}
