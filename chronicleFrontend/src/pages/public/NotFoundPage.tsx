import { Link } from 'react-router-dom';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function NotFoundPage() {
  return (
    <>
      <PublicHeader />
      <main className="container-page grid min-h-[70vh] place-items-center py-20 text-center">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-secondary">404 · Missing Edition</p>
          <h1 className="font-display text-6xl font-bold text-primary">This story is off the record.</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">The page you are looking for may have been moved, archived, or never made it past editorial review.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link className="rounded-lg bg-primary px-6 py-3 font-bold text-white" to="/">Back to Home</Link><Link className="rounded-lg border border-slate-200 bg-white px-6 py-3 font-bold text-primary" to="/news">Browse News</Link></div>
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
