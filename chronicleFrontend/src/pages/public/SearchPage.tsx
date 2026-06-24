import { useDeferredValue, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { articles } from '../../data';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

const filters = ['All Results', 'Latest', 'Technology', 'Education', 'Health', 'Sports'];
const dateFilters = ['All archive', 'Past 30 days', 'Past year'];

export function SearchPage() {
  const [query, setQuery] = useState('digital truth');
  const [activeFilter, setActiveFilter] = useState('All Results');
  const [dateFilter, setDateFilter] = useState('All archive');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const results = articles.filter((article) => {
    const matchesQuery = !deferredQuery || [article.title, article.summary, article.category, article.author].some((value) => value.toLowerCase().includes(deferredQuery));
    const matchesCategory = activeFilter === 'All Results' || activeFilter === 'Latest' || article.category === activeFilter;
    const matchesDate = dateFilter === 'All archive' || (dateFilter === 'Past 30 days' && article.date.includes('October')) || dateFilter === 'Past year';

    return matchesQuery && matchesCategory && matchesDate;
  });

  const resultLabel = query.trim() ? `for "${query.trim()}"` : 'across all articles';

  return (
    <>
      <PublicHeader />
      <main className="container-page py-12">
        <section className="mx-auto mb-12 max-w-5xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-secondary">Chronicle Search</p>
          <h1 className="font-display text-5xl font-bold text-primary md:text-6xl">Find the signal in the archive.</h1>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-blue-500/5">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-5 pl-14 text-lg outline-none focus:border-secondary focus:ring-4 focus:ring-blue-100" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles, authors, topics..." />
                <Icon name="search" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button className="rounded-xl bg-secondary px-10 py-5 font-bold uppercase tracking-wider text-white" type="button">Search</button>
            </div>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow">
              <h2 className="mb-4 font-bold text-primary">Filters</h2>
              <div className="space-y-2">
                {filters.map((filter) => <button key={filter} className={`w-full rounded-lg px-4 py-3 text-left font-bold transition ${activeFilter === filter ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-secondary'}`} type="button" onClick={() => setActiveFilter(filter)}>{filter}</button>)}
              </div>
            </section>
            <section className="rounded-xl bg-primary p-5 text-white">
              <h3 className="font-display mb-2 text-2xl font-semibold">Refine by date</h3>
              <select className="mt-3 w-full rounded-lg bg-white p-3 text-primary" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
                {dateFilters.map((item) => <option key={item}>{item}</option>)}
              </select>
            </section>
          </aside>

          <section>
            <div className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-primary">Search Results</h2>
                <p className="text-slate-600">Showing {results.length} result{results.length === 1 ? '' : 's'} {resultLabel}.</p>
              </div>
              <button className="w-fit rounded-lg border border-slate-200 px-4 py-2 font-bold text-slate-600" type="button">Sort: Relevance</button>
            </div>

            {results.length ? <div className="space-y-6">
              {results.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="group grid gap-5 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg md:grid-cols-[220px_minmax(0,1fr)]"><img className="aspect-video h-full w-full rounded-lg object-cover" src={article.image} alt="" /><div><div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-widest"><span className="text-secondary">{article.category}</span><span className="text-slate-400">{article.date}</span></div><h3 className="font-display text-2xl font-semibold text-primary transition group-hover:text-secondary">{article.title}</h3><p className="mt-2 line-clamp-2 leading-7 text-slate-600">{article.summary}</p><p className="mt-4 text-sm font-bold text-slate-500">By {article.author} · {article.readTime}</p></div></Link>)}
            </div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Icon name="search_off" className="text-5xl text-slate-300" /><h3 className="font-display mt-4 text-3xl font-bold text-primary">No matching articles</h3><p className="mx-auto mt-2 max-w-lg text-slate-600">Try a broader keyword, remove the category filter, or switch the date range back to all archive.</p><button className="mt-6 rounded-lg bg-primary px-5 py-3 font-bold text-white" type="button" onClick={() => { setQuery(''); setActiveFilter('All Results'); setDateFilter('All archive'); }}>Reset Search</button></div>}
          </section>
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
