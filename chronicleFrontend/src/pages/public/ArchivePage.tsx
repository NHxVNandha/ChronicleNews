import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { toSlug } from '../../config/navigation';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function ArchivePage() {
  const years = ['2026', '2025', '2024', '2023'];
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedSection, setSelectedSection] = useState('All Sections');
  const [query, setQuery] = useState('');
  const { articles, error: articleError } = useArticles({ sort: 'newest', limit: 24 });
  const { categories, error: categoryError } = useCategories();
  const error = articleError || categoryError;

  const filteredArticles = articles.filter((article) => {
    const matchesYear = article.date.includes(selectedYear);
    const matchesSection = selectedSection === 'All Sections' || article.category === selectedSection;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || article.title.toLowerCase().includes(normalizedQuery) || article.summary.toLowerCase().includes(normalizedQuery) || article.author.toLowerCase().includes(normalizedQuery);
    return matchesYear && matchesSection && matchesQuery;
  });

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        {error && <div className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <section className="mb-10 rounded-2xl bg-primary p-8 text-white editorial-shadow md:p-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">Chronicle Archive</p>
          <h1 className="font-display max-w-4xl text-5xl font-bold leading-tight md:text-6xl">A living record of the stories that shaped the public conversation.</h1>
          <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px_180px]">
            <input className="rounded-xl border border-white/15 bg-white/10 px-5 py-4 outline-none placeholder:text-white/40 focus:border-secondary" placeholder="Search the archive..." value={query} onChange={(event) => setQuery(event.target.value)} />
            <select className="rounded-xl border border-white/15 bg-white/10 px-5 py-4 outline-none" value={selectedSection} onChange={(event) => setSelectedSection(event.target.value)}><option>All Sections</option>{categories.map((category) => <option key={category.id ?? category.name}>{category.name}</option>)}</select>
            <button className="rounded-xl bg-secondary px-6 py-4 font-bold uppercase tracking-wider text-white">Search</button>
          </div>
        </section>
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow"><h2 className="mb-4 font-bold text-primary">Browse By Year</h2><div className="space-y-2">{years.map((year) => <button key={year} className={`w-full rounded-lg px-4 py-3 text-left font-bold ${selectedYear === year ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`} onClick={() => setSelectedYear(year)} type="button">{year}</button>)}</div></section>
            <section className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow"><h2 className="mb-4 font-bold text-primary">Sections</h2><div className="space-y-2">{categories.map((category) => <Link key={category.id ?? category.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 font-bold text-slate-600 transition hover:bg-blue-50 hover:text-secondary" to={`/topics/${toSlug(category.name)}`}>{category.name}<Icon name="arrow_forward" className="text-base" /></Link>)}</div></section>
          </aside>
          <section className="space-y-5">{filteredArticles.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="group grid gap-5 rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl md:grid-cols-[180px_minmax(0,1fr)]"><img className="aspect-video h-full w-full rounded-lg object-cover" src={article.image} alt="" /><div><div className="mb-2 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-widest"><span className="text-secondary">{article.category}</span><span className="text-slate-400">{article.date}</span></div><h2 className="font-display text-3xl font-semibold text-primary transition group-hover:text-secondary">{article.title}</h2><p className="mt-2 line-clamp-2 leading-7 text-slate-600">{article.summary}</p><p className="mt-4 text-sm font-bold text-slate-500">By {article.author} · {article.readTime}</p></div></Link>)}{!filteredArticles.length && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No archive entries match the current filters.</div>}</section>
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
