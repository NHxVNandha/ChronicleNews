import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicErrorBanner, PublicLoadingBlock } from '../../components/public/PublicAsyncState';
import { Avatar, Icon } from '../../components/ui';
import { authorProfileImage, toSlug } from '../../config/navigation';
import { getPublicArticleDetail, type PublicArticleDetail } from '../../services';
import { Footer, PublicHeader } from '../../layouts/PublicLayout';

export function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<PublicArticleDetail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!slug) return;
      try {
        const result = await getPublicArticleDetail(slug);
        if (!isMounted) return;
        if (!result) {
          setError('Article was not found.');
          return;
        }
        setArticle(result);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load article.');
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!article) {
    return (
      <>
      <PublicHeader />
      <main className="container-page py-16">
          {error ? <PublicErrorBanner message={error} /> : <PublicLoadingBlock className="h-96" />}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <main className="container-page py-16">
        <article className="grid gap-12 lg:grid-cols-12">
          <header className="lg:col-span-12">
            <span className="mb-6 inline-block rounded bg-blue-100 px-3 py-1 text-sm font-bold uppercase tracking-wider text-primary">{article.categoryName}</span>
            <h1 className="font-display max-w-5xl text-5xl font-bold leading-[1.08] text-primary md:text-7xl">{article.title}</h1>
            <div className="mt-10 flex flex-wrap items-center gap-8 border-y border-slate-200 py-8"><div className="flex items-center gap-4"><Avatar src={authorProfileImage} alt={article.authorName} size="h-14 w-14" /><div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Written By</p><Link className="font-bold text-primary hover:text-secondary" to={`/authors/${toSlug(article.authorName)}`}>{article.authorName}</Link></div></div><div className="hidden h-10 w-px bg-slate-200 md:block" /><div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Date Published</p><p>{article.date}</p></div><div className="hidden h-10 w-px bg-slate-200 md:block" /><div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Reading Time</p><p>{article.readTime}</p></div><div className="ml-auto flex gap-3"><button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200"><Icon name="share" /></button><button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200"><Icon name="bookmark" /></button></div></div>
          </header>
          <section className="lg:col-span-12"><img className="aspect-[21/9] w-full rounded-xl object-cover soft-shadow" src={article.image} alt="" /><p className="mt-4 text-sm italic text-slate-500">The internal grid system of the Chronicle newsroom. Photography by Editorial Desk.</p></section>
          <section className="prose prose-slate max-w-none lg:col-span-8" dangerouslySetInnerHTML={{ __html: article.body }} />
          <aside className="space-y-8 lg:col-span-4"><div className="rounded-xl bg-slate-100 p-8"><h3 className="mb-6 border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-widest text-secondary">Key Takeaways</h3><ul className="space-y-3 text-slate-700"><li>Structured editorial workflows preserve context.</li><li>Publishing systems depend on strong taxonomy.</li><li>Human review still matters even with automation.</li></ul></div></aside>
        </article>
      </main>
      <Footer />
    </>
  );
}
