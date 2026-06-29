import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function CategoriesPage() {
  const { categories, error: categoryError } = useCategories();
  const { articles, error: articleError } = useArticles({ sort: 'newest', limit: 12 });
  const error = categoryError || articleError;

  const featuredCategory = categories[0];
  const featuredArticles = useMemo(() => articles.filter((article) => !featuredCategory || article.category === featuredCategory.name), [articles, featuredCategory]);

  return (
    <>
      <PublicHeader />
      <main className="container-page flex flex-col gap-8 py-12 md:flex-row">
        {error && <div className="w-full rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <aside className="w-full shrink-0 space-y-6 md:w-72"><div className="sticky top-24 space-y-6"><div><h2 className="font-display mb-4 border-b border-slate-200 pb-2 text-2xl font-semibold text-primary">Archive Filters</h2><p className="mb-6 leading-7 text-slate-600">Browse our historical database by date and discipline.</p></div><label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-500">Select Year</span><select className="w-full border border-slate-300 bg-slate-100 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-blue-100"><option>2026</option><option>2025</option><option>2024</option></select></label><div><span className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-500">Category</span><nav className="flex flex-col gap-1">{categories.map((category, index) => <a key={category.id ?? category.name} className={`flex items-center justify-between px-4 py-3 font-bold transition ${index === 0 ? 'bg-secondary text-white' : 'hover:bg-slate-200'}`} href={`#${category.name}`}>{category.name}<Icon name="arrow_forward" className="text-lg" /></a>)}</nav></div></div></aside>
        <section className="flex-1"><header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-display text-5xl font-bold leading-tight text-primary">{featuredCategory?.name ?? 'Category Archive'}</h1><p className="mt-2 max-w-2xl text-lg leading-8 text-slate-600">{featuredCategory?.description ?? 'Browse the Chronicle archive by editorial category.'}</p></div><div className="flex gap-2"><button className="border border-slate-200 bg-white p-2"><Icon name="grid_view" /></button><button className="border border-slate-200 p-2 opacity-50"><Icon name="list" /></button></div></header><nav className="mb-8 flex gap-2 overflow-x-auto border-b border-slate-200 pb-4">{categories.map((tab, index) => <a key={tab.id ?? tab.name} className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition ${index === 0 ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-secondary'}`} href={`#${tab.name}`}>{tab.name}</a>)}</nav><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{featuredArticles.map((article) => <article key={article.slug} className="rounded-xl bg-white p-4 soft-shadow"><Link className="block overflow-hidden rounded-lg" to={`/news/${article.slug}`}><img className="aspect-video w-full object-cover" src={article.image} alt="" /></Link><div className="mt-4"><span className="text-sm font-bold uppercase tracking-widest text-secondary">{article.category}</span><Link className="mt-2 block font-display text-2xl font-bold text-primary hover:text-secondary" to={`/news/${article.slug}`}>{article.title}</Link><p className="mt-2 line-clamp-3 text-slate-600">{article.summary}</p></div></article>)}</div></section>
      </main>
      <MinimalFooter text="Dedicated to rigorous journalism and the pursuit of truth in a digital age. Our archives serve as a living history of global progress." />
    </>
  );
}
