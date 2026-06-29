import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { useArticles } from '../../hooks/useArticles';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function PublicSectionPage({ title, eyebrow, description, icon }: { title: string; eyebrow: string; description: string; icon: string }) {
  const { articles, error } = useArticles({ sort: 'newest', limit: 4 });
  const lead = articles[0];
  const supporting = articles.slice(1, 4);

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        {error && <div className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <section className="mb-10 overflow-hidden rounded-2xl bg-primary p-8 text-white editorial-shadow md:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">{eyebrow}</p>
              <h1 className="font-display max-w-4xl text-5xl font-bold leading-tight md:text-6xl">{title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{description}</p>
            </div>
            <div className="hidden justify-self-end rounded-full bg-white/10 p-10 text-blue-200 lg:grid"><Icon name={icon} className="text-7xl" /></div>
          </div>
        </section>
        {lead && <section className="grid gap-6 lg:grid-cols-3"><article className="group relative min-h-[520px] overflow-hidden rounded-2xl bg-primary lg:col-span-2"><img className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105" src={lead.image} alt="" /><div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" /><div className="absolute bottom-0 p-8 text-white"><span className="rounded bg-secondary px-3 py-1 text-sm font-bold uppercase tracking-widest">Lead Story</span><h2 className="font-display mt-4 max-w-3xl text-5xl font-bold leading-tight">{lead.title}</h2><p className="mt-4 max-w-2xl leading-8 text-white/80">{lead.summary}</p></div></article><div className="space-y-5">{supporting.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="block rounded-xl border border-slate-200 bg-white p-5 soft-shadow transition hover:-translate-y-1 hover:shadow-xl"><p className="text-xs font-bold uppercase tracking-widest text-secondary">{article.category}</p><h2 className="font-display mt-2 text-2xl font-semibold text-primary">{article.title}</h2><p className="mt-2 line-clamp-2 text-slate-600">{article.summary}</p></Link>)}</div></section>}
      </main>
      <MinimalFooter />
    </>
  );
}
