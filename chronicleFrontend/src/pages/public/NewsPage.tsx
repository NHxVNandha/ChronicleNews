import { Link } from 'react-router-dom';
import { PublicErrorBanner, PublicLoadingGrid } from '../../components/public/PublicAsyncState';
import { ArticleCard } from '../../components/ui';
import { toSlug, topicList } from '../../config/navigation';
import { useArticles } from '../../hooks/useArticles';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function NewsPage() {
  const { articles, error, loading } = useArticles({ sort: 'newest', limit: 8 });

  const topStories = articles.slice(0, 3);
  const latestNews = articles.slice(3);

  return (
    <>
      <PublicHeader />
      <main className="container-page py-12">
        {error && <PublicErrorBanner message={error} />}
        {loading ? <PublicLoadingGrid count={3} /> : topStories.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-2"><h2 className="font-display text-4xl font-bold text-primary">Top Stories</h2><span className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Live Updates</span></div>
            <div className="grid gap-8 lg:grid-cols-3">
              {topStories.map((story, index) => (
                <article key={story.slug} className={`rounded-xl bg-white p-4 ${index === 0 ? 'lg:col-span-2' : ''}`}>
                  <Link to={`/news/${story.slug}`} className="block overflow-hidden rounded-lg"><img className="aspect-video w-full object-cover" src={story.image} alt="" /></Link>
                  <div className="mt-4"><span className="text-sm font-bold uppercase tracking-widest text-secondary">{story.category}</span><Link className="mt-2 block font-display text-2xl font-bold text-primary hover:text-secondary" to={`/news/${story.slug}`}>{story.title}</Link><p className="mt-2 line-clamp-2 text-slate-600">{story.summary}</p></div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="mb-6 border-b border-slate-200 pb-2"><h2 className="font-display text-3xl font-semibold text-primary">Latest News</h2></div>
            {loading ? <PublicLoadingGrid count={4} /> : <div className="grid gap-6 md:grid-cols-2">{latestNews.map((article) => <ArticleCard key={article.slug} article={article} compact />)}</div>}
          </section>
          <aside className="space-y-12 lg:col-span-4">
            <div className="rounded-lg border border-slate-200 bg-slate-100 p-6"><h3 className="font-display mb-6 text-2xl font-semibold text-primary">Trending Topics</h3><ol className="space-y-4">{topicList.slice(0, 4).map((item, index) => <li key={item} className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-bold text-primary">{index + 1}</span><Link className="font-semibold text-slate-700 hover:text-secondary" to={`/topics/${toSlug(item)}`}>{item}</Link></li>)}</ol></div>
            <div><h3 className="mb-4 border-b border-slate-200 pb-2 text-xl font-bold text-primary">Quick Browse</h3><div className="flex flex-wrap gap-2">{topicList.map((topic) => <Link key={topic} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-secondary" to={`/topics/${toSlug(topic)}`}>{topic}</Link>)}</div></div>
          </aside>
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
