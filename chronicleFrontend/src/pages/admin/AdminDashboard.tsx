import { Link } from 'react-router-dom';
import { SkeletonBlock, SkeletonLine, SkeletonStatCard } from '../../components/Skeleton';
import { AdminInfoCard, AdminPageHeader, AdminPanel, AdminSectionHeader, AdminStatCard, AdminStatusBadge } from '../../components/admin';
import { Icon } from '../../components/ui';
import { useDashboardData } from '../../hooks/admin/useDashboardData';
import { AdminLayout } from '../../layouts/AdminLayout';

const snapshotData = [
  { label: 'Readers Online', value: '1,247', icon: 'online_prediction', color: 'bg-blue-50 text-secondary' },
  { label: 'Articles Today', value: '18', icon: 'today', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Breaking Stories', value: '3', icon: 'bolt', color: 'bg-red-50 text-red-600' },
  { label: 'Avg. Publish Time', value: '24m', icon: 'timer', color: 'bg-purple-50 text-purple-600' },
];

const newsroomAlerts = [
  { label: 'SEO Watch', tone: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'warning' },
  { label: 'Breaking Desk', tone: 'bg-red-50 text-red-700 border-red-200', icon: 'bolt' },
  { label: 'Revenue', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'trending_up' },
];

const scheduleSnapshot = [
  { time: '08:00', title: 'Morning Briefing', desk: 'Front Page', status: 'Locked' },
  { time: '11:30', title: 'Market Pulse', desk: 'Business', status: 'Editing' },
  { time: '15:00', title: 'Campus Reimagined', desk: 'Education', status: 'Scheduled' },
  { time: '19:00', title: 'Election Debate Recap', desk: 'Politics', status: 'Awaiting Review' },
];

export function AdminDashboard() {
  const { summary, pipeline, recentActivity, articles, loading, error } = useDashboardData();

  const metrics = [
    { label: 'Published Articles', value: `${summary.publishedArticles}`, delta: `${summary.mediaAssets.toLocaleString()} assets`, icon: 'article' as const },
    { label: 'Draft Queue', value: `${summary.draftQueue}`, delta: `${pipeline.needsReview} need review`, icon: 'schedule' as const },
    { label: 'Monthly Readers', value: `${Math.round(summary.monthlyReaders / 1000)}K`, delta: 'Live backend data', icon: 'visibility' as const },
    { label: 'Media Assets', value: `${summary.mediaAssets.toLocaleString()}`, delta: 'Synthetic phase 1', icon: 'photo_library' as const },
  ];

  const pipelineStages = [
    { label: 'Drafts', count: pipeline.draft, icon: 'edit_note', color: 'text-slate-500', bg: 'bg-slate-100', bar: 'bg-slate-400' },
    { label: 'In Review', count: pipeline.needsReview, icon: 'rate_review', color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' },
    { label: 'Scheduled', count: pipeline.scheduled, icon: 'schedule', color: 'text-secondary', bg: 'bg-blue-50', bar: 'bg-secondary' },
    { label: 'Published', count: pipeline.published, icon: 'publish', color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
  ];

  return (
    <AdminLayout title="Overview">
      {loading ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
          </div>
          <section>
            <SkeletonLine width="300px" className="mb-1" />
            <SkeletonLine width="450px" />
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
            </div>
            <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
              <SkeletonBlock className="h-[400px]" />
              <SkeletonBlock className="h-[400px]" />
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-10 lg:space-y-12">
          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

          <div>
            <AdminPageHeader
              eyebrow="Editorial Analytics"
              title="Dashboard"
              description="Publishing momentum, workflow pressure, and newsroom activity in one operational view."
              actions={<span className="rounded-full bg-slate-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">Live</span>}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <div key={metric.label}>
                <AdminStatCard
                  label={metric.label}
                  value={metric.value}
                  delta={metric.delta}
                  icon={metric.icon}
                  tone={index === 0 ? 'blue' : index === 1 ? 'amber' : 'default'}
                  variant={index === 0 ? 'primary' : 'compact'}
                />
              </div>
            ))}
          </div>

          <div>
            <AdminPanel
              title="Executive Summary"
              description="Core publishing, audience, and newsroom health in one panel."
              action={<div className="flex flex-wrap gap-2">{newsroomAlerts.map((alert) => <span key={alert.label} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${alert.tone}`}><Icon name={alert.icon} className="text-sm" />{alert.label}</span>)}</div>}
            >
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_320px]">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {metrics.map((metric, index) => (
                  <div key={`${metric.label}-summary`}>
                    <AdminStatCard
                      label={metric.label}
                      value={metric.value}
                      delta={metric.delta}
                      icon={metric.icon}
                      tone={index === 1 ? 'amber' : 'default'}
                    />
                  </div>
                ))}
              </div>
              <AdminPanel title="Today" description="Live status" tone="subtle" padding="md">
                <div className="space-y-3">
                  {snapshotData.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-[2px]">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.color}`}><Icon name={item.icon} className="text-xl" /></span>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                        <p className="mt-1 text-lg font-bold text-slate-950">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AdminPanel>
            </div>
            </AdminPanel>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_360px]">
            <AdminPanel>
              <AdminSectionHeader
                icon={<Icon name="account_tree" className="text-[20px]" />}
                title="Editorial Pipeline"
                description="Real-time view of content workflow from draft to publication."
                meta={<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{pipeline.needsReview} under review</span>}
              />
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {pipelineStages.map((stage) => (
                  <div key={stage.label} className={`rounded-xl border ${stage.bg} border-slate-100 p-4 transition hover:-translate-y-[3px] hover:border-slate-200 hover:bg-white`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-xl ${stage.bg} ${stage.color}`}><Icon name={stage.icon} className="text-[20px]" /></span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${stage.bar} !text-white`}>{stage.count}</span>
                    </div>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{stage.label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-950">{stage.count}</p>
                  </div>
                ))}
              </div>
            </AdminPanel>

            <div className="space-y-6">
              <AdminPanel action={<Link className="text-sm font-bold text-secondary hover:underline" to="/admin/activity">View all</Link>}>
                <AdminSectionHeader icon={<Icon name="history" className="text-[20px]" />} title="Recent Activity" description="Live backend activity log." bordered={false} />
                <div className="mt-4 space-y-2">
                  {recentActivity.map((item, index) => (
                    <div key={index}>
                      <AdminInfoCard
                        leading={<Icon name="history" className="text-[18px]" />}
                        title={`${item.user} ${item.title}`}
                        description={new Date(item.time).toLocaleString()}
                      />
                    </div>
                  ))}
                </div>
              </AdminPanel>

              <AdminPanel action={<Link className="text-sm font-bold text-secondary hover:underline" to="/admin/content">Open editorial</Link>}>
                <AdminSectionHeader title="Schedule Snapshot" description="Upcoming publishing slots for today." bordered={false} />
                <div className="mt-4 space-y-3">
                  {scheduleSnapshot.map((item) => (
                    <div key={`${item.time}-${item.title}`} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:-translate-y-[2px]">
                      <div className="min-w-[60px] rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Slot</p>
                        <p className="mt-1 text-sm font-bold text-slate-950">{item.time}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span>{item.desk}</span>
                          <span className="text-slate-300">•</span>
                          <AdminStatusBadge status={item.status === 'Locked' ? 'published' : item.status === 'Scheduled' ? 'scheduled' : item.status === 'Editing' ? 'draft' : 'needs-review'}>{item.status}</AdminStatusBadge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AdminPanel>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <AdminPanel>
              <AdminSectionHeader title="Top Performing" description="Best-performing stories in the current cycle." meta={<span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">API data</span>} />
              <div className="mt-4 space-y-2">
                {articles.map((article, index) => (
                  <div key={article.slug}>
                    <AdminInfoCard
                      leading={<span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500">#{index + 1}</span>}
                      title={article.title}
                      description={<div className="flex items-center gap-2"><span className="flex items-center gap-1"><Icon name="visibility" className="text-[16px]" />{article.views}</span><AdminStatusBadge status={article.status === 'Published' ? 'published' : article.status === 'Scheduled' ? 'scheduled' : article.status === 'Needs Review' ? 'needs-review' : article.status === 'Archived' ? 'archived' : 'draft'}>{article.status}</AdminStatusBadge></div>}
                    />
                  </div>
                ))}
              </div>
            </AdminPanel>

            <AdminPanel tone="subtle">
              <AdminSectionHeader title="Today" description="Live operational indicators." bordered={false} />
              <div className="mt-4 space-y-3">
                {snapshotData.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-[2px]">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.color}`}><Icon name={item.icon} className="text-xl" /></span>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                      <p className="mt-1 text-lg font-bold text-slate-950">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AdminPanel>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
