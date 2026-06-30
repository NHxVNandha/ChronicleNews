import { motion } from 'framer-motion';

export function RouteLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f5f7fb] px-6 text-center">
      <motion.div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
        <motion.div className="mx-auto h-12 w-12 rounded-2xl bg-slate-950/90" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">Loading Workspace</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-slate-950">Preparing your editorial tools</h2>
        <div className="mt-6 space-y-3">
          <div className="h-4 animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
        </div>
      </motion.div>
    </div>
  );
}
