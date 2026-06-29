import { Link } from 'react-router-dom';
import { PublicErrorBanner, PublicLoadingBlock, PublicLoadingGrid } from '../../components/public/PublicAsyncState';
import { ArticleCard } from '../../components/ui';
import { heroImage } from '../../data';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { Footer, PublicHeader } from '../../layouts/PublicLayout';

export function HomePage() {
  const { articles, error: articleError, loading: articlesLoading } = useArticles({ sort: 'newest', limit: 5 });
  const { categories, error: categoryError, loading: categoriesLoading } = useCategories();
  const error = articleError || categoryError;

  const featured = articles[0];

  return (
    <>
      <PublicHeader dark />
      <main className="container-page space-y-16 py-12">
        {error && <PublicErrorBanner message={error} />}
        {articlesLoading ? <PublicLoadingBlock className="h-[420px] lg:h-[600px]" /> : featured && (
          <section className="grid overflow-hidden rounded-xl bg-white editorial-shadow lg:grid-cols-12">
            <div className="relative h-[420px] lg:col-span-7 lg:h-[600px]">
              <img className="h-full w-full object-cover" src={heroImage} alt="Futuristic city skyline" />
              <span className="absolute left-6 top-6 rounded-full bg-secondary px-4 py-1 text-sm font-bold uppercase tracking-wider text-white">Featured</span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:col-span-5 lg:p-12">
              <span className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-secondary">{featured.category}</span>
              <h1 className="font-display text-4xl font-bold leading-tight text-primary lg:text-5xl">{featured.title}</h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">{featured.summary}</p>
              <Link to={`/news/${featured.slug}`} className="mt-8 inline-flex w-fit rounded-lg bg-secondary px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-blue-600">
                Read Investigation
              </Link>
            </div>
          </section>
        )}

        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-3xl font-bold italic text-primary">Latest Reports</h2>
            <Link className="font-bold uppercase tracking-wider text-secondary" to="/archive">View Archive</Link>
          </div>
          {articlesLoading ? <PublicLoadingGrid count={4} /> : <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">{articles.slice(1, 5).map((article) => <ArticleCard key={article.slug} article={article} compact />)}</div>}
        </section>

        <section className="grid gap-10 border-t border-slate-200 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display inline-block border-b-4 border-secondary pb-2 text-3xl font-bold text-primary">Editorial Desk</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">Curated reporting from trusted editors, with clear taxonomy and transparent publication workflows.</p>
          </div>
          {categoriesLoading ? <div className="grid gap-6 lg:col-span-8 md:grid-cols-2"><PublicLoadingGrid count={4} /></div> : <div className="grid gap-6 lg:col-span-8 md:grid-cols-2">
            {categories.map((category) => (
              <div key={category.id ?? category.name} className="rounded-xl bg-white p-6 soft-shadow">
                <div className={`mb-5 h-2 w-14 rounded-full ${category.tone ?? 'bg-secondary'}`} />
                <h3 className="font-display text-2xl font-semibold text-primary">{category.name}</h3>
                <p className="mt-3 text-slate-600">{category.description}</p>
                <p className="mt-5 text-sm font-bold uppercase tracking-wider text-secondary">{category.count ?? 0} Articles</p>
              </div>
            ))}
          </div>}
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-primary p-10 text-white editorial-shadow lg:p-16">
          <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-secondary/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl font-bold lg:text-5xl">Stay Structural.</h2>
            <p className="mt-4 text-lg text-white/70">Receive the daily editorial briefing at 6 AM.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input className="flex-1 rounded-lg border border-white/20 bg-white/10 p-4 text-white outline-none placeholder:text-white/40 focus:border-secondary" placeholder="Your Email Address" />
              <button className="rounded-lg bg-secondary px-10 py-4 font-bold uppercase tracking-wider text-white">Subscribe</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
