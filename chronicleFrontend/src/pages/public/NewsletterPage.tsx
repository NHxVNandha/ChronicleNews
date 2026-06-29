import { useArticles } from '../../hooks/useArticles';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function NewsletterPage() {
  const { articles, error } = useArticles({ sort: 'popular', limit: 3 });

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        {error && <div className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <section className="mx-auto max-w-4xl rounded-2xl bg-primary p-8 text-center text-white editorial-shadow md:p-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">Daily Briefing</p>
          <h1 className="font-display text-5xl font-bold md:text-6xl">Newsletter Chronicle untuk pembaca yang butuh konteks, bukan sekadar headline.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">Terima rangkuman berita nasional, global, bisnis, teknologi, dan opini redaksi setiap pagi.</p>
          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"><input className="flex-1 rounded-xl border border-white/15 bg-white/10 px-5 py-4 outline-none placeholder:text-white/40" placeholder="email@domain.com" /><button className="rounded-xl bg-secondary px-8 py-4 font-bold uppercase tracking-wider text-white">Subscribe</button></div>
        </section>
        <section className="mt-12 grid gap-6 md:grid-cols-3">{articles.map((article) => <article key={article.slug} className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow"><p className="text-xs font-bold uppercase tracking-widest text-secondary">{article.category}</p><h2 className="font-display mt-3 text-2xl font-bold text-primary">{article.title}</h2><p className="mt-3 line-clamp-3 text-slate-600">{article.summary}</p></article>)}</section>
      </main>
      <MinimalFooter />
    </>
  );
}
