import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArticleCard, Avatar } from '../../components/ui';
import { adminProfileImage, authorProfileImage, toSlug } from '../../config/navigation';
import type { Article } from '../../data';
import { getArticles } from '../../services';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

function buildAuthors(articles: Article[]) {
  return Array.from(new Map(articles.map((article) => [article.author, article])).values());
}

export function AuthorsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const articleData = await getArticles({ sort: 'newest', limit: 24 });
        if (isMounted) setArticles(articleData);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load authors.');
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const authors = useMemo(() => buildAuthors(articles), [articles]);

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        {error && <div className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <header className="mb-10 max-w-3xl"><p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-secondary">Editorial Voices</p><h1 className="font-display text-5xl font-bold text-primary md:text-6xl">Meet the writers behind Chronicle.</h1><p className="mt-4 text-lg leading-8 text-slate-600">Follow reporters, analysts, and editors by beat, expertise, and recent coverage.</p></header>
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{authors.map((article, index) => <Link key={article.author} to={`/authors/${toSlug(article.author)}`} className="group rounded-2xl border border-slate-200 bg-white p-6 soft-shadow transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-5 flex items-center gap-4"><Avatar src={index % 2 ? adminProfileImage : authorProfileImage} alt={article.author} size="h-16 w-16" /><div><h2 className="font-display text-2xl font-bold text-primary group-hover:text-secondary">{article.author}</h2><p className="text-sm font-bold uppercase tracking-widest text-slate-500">{article.category}</p></div></div><p className="leading-7 text-slate-600">Specializes in deeply reported coverage across {article.category.toLowerCase()}, institutional systems, and public accountability.</p><p className="mt-5 font-bold text-secondary">View profile</p></Link>)}</section>
      </main>
      <MinimalFooter />
    </>
  );
}

export function AuthorDetailPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const articleData = await getArticles({ sort: 'newest', limit: 24 });
        if (isMounted) setArticles(articleData);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load author profile.');
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const authorArticles = articles.filter((article) => toSlug(article.author) === slug);
  const lead = authorArticles[0] ?? articles[0];
  const visibleArticles = authorArticles.length ? authorArticles : articles.slice(0, 3);

  if (!lead) {
    return (
      <>
        <PublicHeader />
        <main className="container-page py-14"><div className="rounded-lg bg-white p-8 text-slate-600">{error || 'Loading author profile...'}</div></main>
        <MinimalFooter />
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        {error && <div className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <section className="mb-10 grid gap-8 rounded-2xl bg-white p-8 soft-shadow md:grid-cols-[220px_minmax(0,1fr)] md:p-10"><Avatar src={authorProfileImage} alt={lead.author} size="h-44 w-44" /><div><p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-secondary">Author Profile</p><h1 className="font-display text-5xl font-bold text-primary">{lead.author}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Chronicle contributor covering {lead.category.toLowerCase()} with a focus on clarity, evidence, and the systems behind breaking news.</p><div className="mt-6 flex flex-wrap gap-3"><span className="rounded-full bg-blue-50 px-4 py-2 font-bold text-secondary">{lead.category}</span><span className="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-600">{visibleArticles.length} articles</span></div></div></section>
        <section className="space-y-5">{visibleArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</section>
      </main>
      <MinimalFooter />
    </>
  );
}
