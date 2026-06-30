import { Link } from 'react-router-dom';
import { ArticleDataTable } from '../../components/ArticleDataTable';
import { SkeletonBlock, SkeletonLine, SkeletonTable } from '../../components/Skeleton';
import { AdminInfoCard, AdminPageHeader, AdminPanel, AdminSectionHeader, AdminStatCard, AdminStatusBadge } from '../../components/admin';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Icon } from '../../components/ui';
import { useAdminArticles } from '../../hooks/admin/useAdminArticles';
import { deleteArticle, updateArticle } from '../../services';

export function AdminContentHub() {
  const { articles, setArticles, loading, error } = useAdminArticles();

  const drafts = articles.filter((article) => article.status === 'Draft');
  const reviewQueue = articles.filter((article) => article.status === 'Needs Review' || article.status === 'Draft');
  const scheduledArticles = articles.filter((article) => article.status === 'Scheduled');
  const publishedArticles = articles.filter((article) => article.status === 'Published');
  const totalViews = publishedArticles.reduce((total, article) => total + Number.parseInt(article.views.replace(/[^\d]/g, ''), 10), 0);

  async function handleDelete(slug: string) {
    await deleteArticle(slug);
    setArticles((current) => current.filter((article) => article.slug !== slug));
  }

  async function handlePublish(slug: string) {
    const updated = await updateArticle(slug, { status: 'Published' });
    setArticles((current) => current.map((article) => article.slug === slug ? updated : article));
  }

  const summaryItems = [
    { label: 'All Articles', value: articles.length, helper: `${publishedArticles.length} published live`, icon: 'description', tone: 'blue' as const },
    { label: 'Draft Queue', value: drafts.length, helper: `${reviewQueue.length} total in workflow`, icon: 'edit_note', tone: 'amber' as const },
    { label: 'Needs Review', value: articles.filter((article) => article.status === 'Needs Review').length, helper: 'Priority before publishing', icon: 'rate_review', tone: 'default' as const },
    { label: 'Scheduled', value: scheduledArticles.length, helper: `${Math.round(totalViews / 1000)}K published reach`, icon: 'schedule', tone: 'default' as const },
  ];

  return (
    <AdminLayout title="Content">
      {loading ? (
        <div className="space-y-8">
          <div className="space-y-2">
            <SkeletonLine width="280px" />
            <SkeletonLine width="420px" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SkeletonLine width="80px" />
                <SkeletonLine width="40px" className="mt-2" />
              </div>
            ))}
          </div>
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5 space-y-1">
              <SkeletonLine width="240px" />
              <SkeletonLine width="360px" />
            </div>
            <div className="p-5">
              <SkeletonTable rows={4} />
            </div>
          </section>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <SkeletonBlock className="h-64 rounded-2xl" />
            <SkeletonBlock className="h-64 rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-10 lg:space-y-12">
          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

          <AdminPageHeader
            eyebrow="Editorial Workflow"
            title="Content Workspace"
            description="Articles, review queue, and publishing schedule grouped into one operational workspace."
            actions={<Link className="rounded-xl bg-secondary px-5 py-3 text-sm font-bold !text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-600" to="/admin/articles/new">Create Article</Link>}
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryItems.map((item, index) => (
              <AdminStatCard
                key={item.label}
                label={item.label}
                value={item.value}
                helper={item.helper}
                icon={item.icon}
                tone={index === 0 ? 'blue' : item.tone}
                variant={index === 0 ? 'primary' : 'compact'}
              />
            ))}
          </div>

          <AdminPanel
            title="Editorial Summary"
            description="Production volume, review pressure, scheduled output, and published reach in one view."
            action={<div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700"><Icon name="warning" className="text-base" />{reviewQueue.length} items need editorial attention</div>}
          >
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
              <AdminPanel title="Content Library" description="Filter published, draft, scheduled, review, and archived content in one editorial table." padding="md">
                <div className="-mx-6 -mb-6 mt-1 overflow-hidden rounded-b-2xl">
                  <ArticleDataTable articles={articles} showSelection={false} showFilters={false} onDelete={handleDelete} onPublish={handlePublish} />
                </div>
              </AdminPanel>

              <aside className="space-y-6">
                <AdminPanel>
                  <AdminSectionHeader
                    icon={<Icon name="rate_review" className="text-[20px]" />}
                    title="Review Queue"
                    description="Drafts and submissions waiting on editor action."
                    meta={<span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">{reviewQueue.length} open</span>}
                    bordered={false}
                  />
                  <div className="mt-4 space-y-2">
                    {reviewQueue.map((article, index) => (
                      <AdminInfoCard
                        key={article.slug}
                        leading={<Icon name={article.status === 'Needs Review' ? 'rate_review' : 'edit_note'} className="text-[18px]" />}
                        title={article.title}
                        description={<div className="space-y-2"><div className="flex flex-wrap items-center gap-2"><AdminStatusBadge status={article.status === 'Needs Review' ? 'needs-review' : 'draft'}>{article.status}</AdminStatusBadge><AdminStatusBadge status={index === 0 ? 'flagged' : 'pending'}>{index === 0 ? 'Priority' : 'Normal'}</AdminStatusBadge></div><p>{article.author} · Updated {article.updatedAt}</p></div>}
                        action={<Link className="rounded-lg bg-slate-950 px-3 py-2 text-[11px] font-bold !text-white transition hover:bg-slate-800" to={`/admin/articles/${article.slug}/edit`}>Open Review</Link>}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:bg-white"
                      />
                    ))}
                  </div>
                </AdminPanel>

                <AdminPanel>
                  <AdminSectionHeader
                    icon={<Icon name="calendar_month" className="text-[20px]" />}
                    title="Publishing Schedule"
                    description="Upcoming stories and editorial slots for the current cycle."
                    meta={<span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Today</span>}
                    bordered={false}
                  />
                  <div className="mt-4 space-y-3">
                    {[
                      { slot: '08:00', day: 'Mon', title: articles[0]?.title ?? 'Morning Briefing', status: 'Published' },
                      { slot: '11:30', day: 'Tue', title: articles[3]?.title ?? 'Market Pulse', status: 'Editing' },
                      { slot: '15:00', day: 'Wed', title: scheduledArticles[0]?.title ?? articles[4]?.title ?? 'Scheduled Story', status: 'Scheduled' },
                      { slot: '19:00', day: 'Thu', title: articles[2]?.title ?? 'Awaiting Review', status: 'Awaiting Review' },
                    ].map((item) => (
                      <div key={`${item.day}-${item.slot}`} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="min-w-[60px] rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.day}</p>
                          <p className="mt-1 text-sm font-bold text-slate-950">{item.slot}</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-900">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-500">Homepage slot editorial block</p>
                        </div>
                        <AdminStatusBadge status={item.status === 'Published' ? 'published' : item.status === 'Scheduled' ? 'scheduled' : item.status === 'Editing' ? 'draft' : 'needs-review'}>{item.status}</AdminStatusBadge>
                      </div>
                    ))}
                  </div>
                </AdminPanel>
              </aside>
            </div>
          </AdminPanel>
        </div>
      )}
    </AdminLayout>
  );
}
