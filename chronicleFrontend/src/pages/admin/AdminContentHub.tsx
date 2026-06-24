import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleDataTable } from '../../components/ArticleDataTable';
import { SkeletonBlock, SkeletonLine, SkeletonTable } from '../../components/Skeleton';
import { articles } from '../../data';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Icon } from '../../components/ui';

export function AdminContentHub() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const drafts = articles.filter((article) => article.status === 'Draft');
  const reviewQueue = articles.filter((article) => article.status === 'Needs Review' || article.status === 'Draft');
  const scheduledArticles = articles.filter((article) => article.status === 'Scheduled');
  const publishedArticles = articles.filter((article) => article.status === 'Published');
  const totalViews = publishedArticles.reduce((total, article) => total + Number.parseInt(article.views.replace(/[^\d]/g, ''), 10), 0);

  return (
    <AdminLayout title="Content">
      {loading ? (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <SkeletonLine width="280px" />
              <SkeletonLine width="420px" />
            </div>
            <SkeletonBlock className="h-12 w-40" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                <SkeletonLine width="80px" />
                <SkeletonLine width="40px" className="mt-2" />
              </div>
            ))}
          </div>
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5 space-y-1">
              <SkeletonLine width="240px" />
              <SkeletonLine width="360px" />
            </div>
            <div className="p-5">
              <SkeletonTable rows={4} />
            </div>
          </section>
          <div className="grid gap-8 xl:grid-cols-2">
            <SkeletonBlock className="h-64" />
            <SkeletonBlock className="h-64" />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-primary">Content Workspace</h1>
              <p className="mt-2 max-w-3xl text-slate-600">Articles, editor, review queue, and calendar are grouped into one editorial workflow.</p>
            </div>
            <Link className="rounded-lg bg-primary px-5 py-3 font-bold !text-white" to="/admin/articles/new">Create Article</Link>
          </div>
          <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-primary">Editorial Summary</h2>
                <p className="mt-1 text-slate-600">Production volume, review pressure, scheduled output, and published reach in one view.</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
                <Icon name="warning" className="text-base" />
                {reviewQueue.length} items need editorial attention today
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'All Articles', value: articles.length, meta: `${publishedArticles.length} published live` },
                { label: 'Draft Queue', value: drafts.length, meta: `${reviewQueue.length} total in workflow` },
                { label: 'Needs Review', value: articles.filter((article) => article.status === 'Needs Review').length, meta: 'Priority before publishing' },
                { label: 'Scheduled', value: scheduledArticles.length, meta: `${totalViews}K published reach` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="font-display mt-2 text-3xl font-bold text-primary">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white soft-shadow">
              <div className="border-b border-slate-200 p-5">
                <h2 className="font-display text-3xl font-bold text-primary">Content Library</h2>
                <p className="mt-1 text-slate-600">Filter published, draft, scheduled, review, and archived content in one editorial table.</p>
              </div>
              <ArticleDataTable articles={articles} showSelection={false} showFilters={false} />
            </section>

            <aside className="space-y-6">
              <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Review Queue</h2>
                    <p className="text-sm text-slate-500">Drafts and submissions waiting on editor action.</p>
                  </div>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">{reviewQueue.length} open</span>
                </div>
                <div className="divide-y divide-slate-200">
                  {reviewQueue.map((article, index) => (
                    <div key={article.slug} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${article.status === 'Needs Review' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{article.status}</span>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${index === 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{index === 0 ? 'Priority' : 'Normal'}</span>
                          </div>
                          <h3 className="mt-3 pr-3 text-[15px] font-bold leading-6 text-primary">{article.title}</h3>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{article.author} · Updated {article.updatedAt}</p>
                      <div className="mt-3 flex gap-2">
                        <Link className="rounded-md bg-primary px-3 py-2 text-xs font-bold !text-white" to={`/admin/articles/${article.slug}/edit`}>Open Review</Link>
                        <button className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700" type="button">Assign</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Publishing Schedule</h2>
                    <p className="text-sm text-slate-500">Upcoming stories and editorial slots for the current cycle.</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Today</span>
                </div>
                <div className="divide-y divide-slate-200">
                  {[
                    { slot: '08:00', day: 'Mon', title: articles[0].title, status: 'Published' },
                    { slot: '11:30', day: 'Tue', title: articles[3].title, status: 'Editing' },
                    { slot: '15:00', day: 'Wed', title: scheduledArticles[0]?.title ?? articles[4].title, status: 'Scheduled' },
                    { slot: '19:00', day: 'Thu', title: articles[2].title, status: 'Awaiting Review' },
                  ].map((item) => (
                    <div key={`${item.day}-${item.slot}`} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                      <div className="min-w-[58px] rounded-md bg-slate-50 px-2.5 py-2 text-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.day}</p>
                        <p className="text-sm font-bold text-primary">{item.slot}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-6 text-primary">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">Homepage slot editorial block</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${item.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : item.status === 'Editing' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
