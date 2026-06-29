export function PublicErrorBanner({ message }: { message: string }) {
  return <div className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</div>;
}

export function PublicLoadingGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-xl bg-slate-100" />)}
    </div>
  );
}

export function PublicLoadingBlock({ className = 'h-64' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />;
}
