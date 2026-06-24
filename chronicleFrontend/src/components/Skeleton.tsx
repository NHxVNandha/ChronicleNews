export function SkeletonLine({ width = '100%', className = '' }: { width?: string; className?: string }) {
  return <div className={`h-4 animate-pulse rounded bg-slate-200 ${className}`} style={{ width }} />;
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />;
}

export function SkeletonCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white soft-shadow">
      <div className="aspect-video animate-pulse bg-slate-200" />
      <div className={compact ? 'space-y-3 p-5' : 'space-y-3 p-6'}>
        <div className="flex items-center gap-3">
          <SkeletonLine width="80px" />
          <SkeletonLine width="100px" />
        </div>
        <SkeletonLine width="90%" />
        <SkeletonLine width="60%" />
        <SkeletonLine width="40%" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-6 border-b border-slate-200 pb-4">
        {[180, 120, 80, 80, 80, 100].map((w, i) => <SkeletonLine key={i} width={`${w}px`} />)}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-6 border-b border-slate-100 pb-4">
          {[180, 120, 80, 80, 80, 100].map((w, j) => <SkeletonLine key={j} width={`${w}px`} />)}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
      <SkeletonLine width="100px" />
      <SkeletonLine width="80px" className="mt-3" />
      <SkeletonLine width="50px" className="mt-2" />
    </div>
  );
}

export function SkeletonSidebar() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg p-3">
          <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
          <SkeletonLine width={`${60 + Math.random() * 30}%`} />
        </div>
      ))}
    </div>
  );
}
