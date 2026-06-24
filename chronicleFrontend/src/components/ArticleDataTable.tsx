import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../data';
import { Icon } from './ui';

type ArticleStatus = Article['status'];
type StatusFilter = 'All' | ArticleStatus;

const statuses: StatusFilter[] = ['All', 'Published', 'Draft', 'Scheduled', 'Needs Review', 'Archived'];

const statusTone: Record<ArticleStatus, string> = {
  Published: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-amber-100 text-amber-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  'Needs Review': 'bg-purple-100 text-purple-700',
  Archived: 'bg-slate-200 text-slate-600',
};

export function ArticleDataTable({ articles, compact = false, showSelection = true, showFilters = true }: { articles: Article[]; compact?: boolean; showSelection?: boolean; showFilters?: boolean }) {
  const [rows, setRows] = useState(articles);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('All');
  const [query, setQuery] = useState('');

  const setArticleStatus = (slug: string, status: ArticleStatus) => {
    setRows((currentRows) => currentRows.map((article) => article.slug === slug ? { ...article, status, updatedAt: 'Just now' } : article));
  };

  const deleteArticle = (slug: string) => {
    setRows((currentRows) => currentRows.filter((article) => article.slug !== slug));
  };

  const filteredArticles = rows.filter((article) => {
    const matchesStatus = activeStatus === 'All' || article.status === activeStatus;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.author.toLowerCase().includes(normalizedQuery) ||
      article.category.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  const counts = statuses.reduce<Record<StatusFilter, number>>((acc, status) => {
    acc[status] = status === 'All' ? rows.length : rows.filter((article) => article.status === status).length;
    return acc;
  }, {} as Record<StatusFilter, number>);

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
        {showFilters && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-bold transition ${activeStatus === 'All' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-secondary'}`}
              onClick={() => setActiveStatus('All')}
              type="button"
            >
              All
            </button>
            <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:inline-block" />
            {statuses.filter((status) => status !== 'All').map((status) => (
              <button
                key={status}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-bold transition ${activeStatus === status ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-secondary'}`}
                onClick={() => setActiveStatus(status)}
                type="button"
              >
                {status} <span className={`ml-1 ${activeStatus === status ? 'text-white/70' : 'opacity-60'}`}>{counts[status]}</span>
              </button>
            ))}
          </div>
        )}
        <label className={`relative block min-w-0 ${showFilters ? 'lg:w-64' : 'lg:w-72'}`}>
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-secondary"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, author, category..."
            value={query}
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              {showSelection && <th className="w-10 px-4 py-3"><input className="h-4 w-4 accent-blue-600" type="checkbox" /></th>}
              <th className="px-4 py-3 font-bold">Title</th>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Author</th>
              <th className="px-4 py-3 font-bold">Status</th>
              {!compact && <th className="px-4 py-3 font-bold">Updated</th>}
              {!compact && <th className="px-4 py-3 font-bold">Views</th>}
              <th className="px-4 py-3 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredArticles.map((article) => (
              <tr key={article.slug} className="hover:bg-slate-50/60">
                {showSelection && <td className="px-4 py-4"><input className="h-4 w-4 accent-blue-600" type="checkbox" /></td>}
                <td className="min-w-72 px-4 py-4">
                  <Link className="font-bold leading-6 text-primary hover:text-secondary" to={`/admin/articles/${article.slug}/edit`}>{article.title}</Link>
                  <p className="mt-0.5 text-xs text-slate-500">{article.date}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{article.category}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{article.author}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusTone[article.status]}`}>{article.status}</span></td>
                {!compact && <td className="px-4 py-4 text-sm text-slate-600">{article.updatedAt}</td>}
                {!compact && <td className="px-4 py-4 text-sm font-bold text-primary">{article.views}</td>}
                <td className="px-4 py-4 text-right align-top">
                  <div className="flex flex-col items-end gap-1.5">
                    {!compact && article.status !== 'Published' && <button className="rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700" onClick={() => setArticleStatus(article.slug, 'Published')} type="button">Publish</button>}
                    <Link className="inline-flex rounded-md p-1.5 text-slate-500 hover:bg-blue-50 hover:text-secondary" to={`/admin/articles/${article.slug}/edit`}><Icon name="edit" /></Link>
                    <Link className="inline-flex rounded-md p-1.5 text-slate-500 hover:bg-blue-50 hover:text-primary" to={`/news/${article.slug}`}><Icon name="visibility" /></Link>
                    <button className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => deleteArticle(article.slug)} type="button"><Icon name="delete" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredArticles.length && (
              <tr>
                <td className="px-5 py-10 text-center text-slate-500" colSpan={showSelection ? (compact ? 6 : 8) : (compact ? 5 : 7)}>No articles match the current filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
