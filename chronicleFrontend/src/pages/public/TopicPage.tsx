import { useParams } from 'react-router-dom';
import { ArticleCard } from '../../components/ui';
import { toSlug, topicList } from '../../config/navigation';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function TopicPage() {
  const { slug } = useParams();
  const { articles, error: articleError } = useArticles({ sort: 'newest', limit: 12 });
  const { categories, error: categoryError } = useCategories();
  const error = articleError || categoryError;

  const title = topicList.find((topic) => toSlug(topic) === slug) ?? categories.find((category) => toSlug(category.name) === slug)?.name ?? 'Editorial Topic';
  const relatedArticles = articles.filter((article) => article.category === title || title.toLowerCase().includes(article.category.toLowerCase())).slice(0, 4);
  const visibleArticles = relatedArticles.length ? relatedArticles : articles;

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        {error && <div className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <header className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 soft-shadow md:p-10"><p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-secondary">Topic Desk</p><h1 className="font-display text-5xl font-bold text-primary md:text-6xl">{title}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">A curated stream of reporting, analysis, and archive material connected to {title.toLowerCase()}.</p></header>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{visibleArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
      </main>
      <MinimalFooter />
    </>
  );
}
