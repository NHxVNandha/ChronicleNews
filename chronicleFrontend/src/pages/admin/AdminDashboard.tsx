import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonBlock, SkeletonLine, SkeletonStatCard } from '../../components/Skeleton';
import { Icon } from '../../components/ui';
import { AdminLayout } from '../../layouts/AdminLayout';
import { getArticles, getDashboardPipeline, getDashboardRecentActivity, getDashboardSummary, type DashboardRecentActivity } from '../../services';
import type { Article } from '../../data';

const snapshotData = [
  { label: 'Readers Online', value: '1,247', icon: 'online_prediction', color: 'bg-blue-50 text-secondary' },
  { label: 'Articles Today', value: '18', icon: 'today', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Breaking Stories', value: '3', icon: 'bolt', color: 'bg-red-50 text-red-600' },
  { label: 'Avg. Publish Time', value: '24m', icon: 'timer', color: 'bg-purple-50 text-purple-600' },
];

const newsroomAlerts = [
  { label: 'SEO Watch', detail: '14 articles missing updated meta descriptions', tone: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'warning' },
  { label: 'Breaking Desk', detail: '3 active developing stories need live updates', tone: 'bg-red-50 text-red-700 border-red-200', icon: 'bolt' },
  { label: 'Revenue', detail: 'Homepage CTR up 6.1% after hero slot rotation', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'trending_up' },
];

const scheduleSnapshot = [
  { time: '08:00', title: 'Morning Briefing', desk: 'Front Page', status: 'Locked' },
  { time: '11:30', title: 'Market Pulse', desk: 'Business', status: 'Editing' },
  { time: '15:00', title: 'Campus Reimagined', desk: 'Education', status: 'Scheduled' },
  { time: '19:00', title: 'Election Debate Recap', desk: 'Politics', status: 'Awaiting Review' },
];

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ publishedArticles: 0, draftQueue: 0, mediaAssets: 0, monthlyReaders: 0 });
  const [pipeline, setPipeline] = useState({ draft: 0, needsReview: 0, scheduled: 0, published: 0 });
  const [recentActivity, setRecentActivity] = useState<DashboardRecentActivity[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [summaryData, pipelineData, activityData, articlesData] = await Promise.all([
          getDashboardSummary(),
          getDashboardPipeline(),
          getDashboardRecentActivity(),
          getArticles({ sort: 'popular', limit: 4 }),
        ]);

        if (!isMounted) return;
        setSummary(summaryData);
        setPipeline(pipelineData);
        setRecentActivity(activityData);
        setArticles(articlesData);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = [
    { label: 'Published Articles', value: `${summary.publishedArticles}`, delta: `${summary.mediaAssets.toLocaleString()} assets`, icon: 'article' },
    { label: 'Draft Queue', value: `${summary.draftQueue}`, delta: `${pipeline.needsReview} need review`, icon: 'schedule' },
    { label: 'Monthly Readers', value: `${Math.round(summary.monthlyReaders / 1000)}K`, delta: 'Live backend data', icon: 'visibility' },
    { label: 'Media Assets', value: `${summary.mediaAssets.toLocaleString()}`, delta: 'Synthetic phase 1', icon: 'photo_library' },
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
        <div className="space-y-10">
          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-white"><Icon name="analytics" /></span>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold text-primary">Overview</h2>
                <p className="text-sm text-slate-500">Key metrics, readership, and publishing momentum</p>
              </div>
            </div>
            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">Executive Summary</h3>
                  <p className="text-sm text-slate-500">Core publishing, audience, and newsroom health in one panel</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newsroomAlerts.map((alert) => <div key={alert.label} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${alert.tone}`}><Icon name={alert.icon} className="text-sm" />{alert.label}</div>)}
                </div>
              </div>
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => <div key={metric.label} className="rounded-lg bg-slate-50 p-4"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{metric.label}</p><p className="font-display mt-2 text-3xl font-bold text-primary">{metric.value}</p><p className="mt-1 text-sm font-bold text-secondary">{metric.delta}</p></div>)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-5">
                  <div className="mb-4 flex items-center justify-between"><h4 className="text-lg font-bold text-primary">Today</h4><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live status</span></div>
                  <div className="space-y-3">{snapshotData.map((item) => <div key={item.label} className="flex items-center gap-3 rounded-lg bg-white p-3"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${item.color}`}><Icon name={item.icon} className="text-xl" /></span><div className="flex-1"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p><p className="text-lg font-bold text-primary">{item.value}</p></div></div>)}</div>
                </div>
              </div>
            </section>
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4"><span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-600 text-white"><Icon name="account_tree" /></span><div className="flex-1"><h2 className="font-display text-2xl font-bold text-primary">Editorial Pipeline</h2><p className="text-sm text-slate-500">Real-time view of content workflow from draft to publication</p></div></div>
            <div className="grid gap-0 md:grid-cols-4 md:gap-3 xl:gap-5">{pipelineStages.map((stage, i) => <div key={stage.label} className="relative"><div className={`rounded-xl border ${stage.bg} border-slate-200 p-5 soft-shadow`}><div className="flex items-center justify-between"><span className={`grid h-10 w-10 place-items-center rounded-lg ${stage.bg} ${stage.color}`}><Icon name={stage.icon} className="text-xl" /></span><span className={`rounded-full px-3 py-1 text-xs font-bold ${stage.bar} !text-white`}>{stage.count}</span></div><p className="mt-4 text-sm font-bold uppercase tracking-wider text-slate-500">{stage.label}</p></div>{i < pipelineStages.length - 1 && <div className="hidden md:absolute md:-right-2.5 md:top-1/2 md:z-10 md:flex md:-translate-y-1/2 md:items-center md:justify-center"><span className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm"><Icon name="chevron_right" className="text-lg" /></span></div>}</div>)}</div>
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white"><Icon name="article" /></span><div className="flex-1"><h2 className="font-display text-2xl font-bold text-primary">Content & Performance</h2><p className="text-sm text-slate-500">Top-performing stories and recent editorial activity from the API.</p></div></div>
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow"><div className="mb-5 flex items-center justify-between"><h3 className="text-xl font-bold text-primary">Top Performing</h3><span className="text-sm font-bold uppercase tracking-wider text-slate-400">API data</span></div><div className="space-y-4">{articles.map((article, i) => <div key={article.slug} className="group flex items-start gap-4 rounded-lg p-3 transition hover:bg-slate-50"><span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-500">#{i + 1}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold text-primary">{article.title}</p><div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500"><span className="flex items-center gap-1"><Icon name="visibility" className="text-sm" />{article.views}</span><span className={`rounded-full px-2 py-0.5 font-bold ${article.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{article.status}</span></div></div><Icon name="chevron_right" className="mt-1.5 text-slate-300 opacity-0 transition group-hover:opacity-100" /></div>)}</div></section>
              <aside className="space-y-6">
                <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow"><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-secondary"><Icon name="history" /></span><div><h3 className="text-xl font-bold text-primary">Recent Activity</h3><p className="text-sm text-slate-500">Live backend activity log</p></div></div><Link className="text-sm font-bold text-secondary hover:underline" to="/admin/activity">View all</Link></div><div className="space-y-3">{recentActivity.map((item, i) => <div key={i} className="flex items-start gap-4 rounded-lg p-3 transition hover:bg-slate-50"><span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-white bg-blue-500"><Icon name="history" className="text-lg" /></span><div className="flex-1"><p className="text-sm font-semibold text-slate-700"><span className="text-primary">{item.user}</span> {item.title}</p><p className="text-xs text-slate-400">{new Date(item.time).toLocaleString()}</p></div></div>)}</div></section>
                <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-xl font-bold text-primary">Schedule Snapshot</h3><p className="text-sm text-slate-500">Upcoming publishing slots for today</p></div><Link className="text-sm font-bold text-secondary hover:underline" to="/admin/content">Open editorial</Link></div><div className="space-y-3">{scheduleSnapshot.map((item) => <div key={`${item.time}-${item.title}`} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"><div className="min-w-[58px] rounded-lg bg-white px-3 py-2 text-center shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Slot</p><p className="text-sm font-bold text-primary">{item.time}</p></div><div className="min-w-0 flex-1"><p className="truncate font-semibold text-primary">{item.title}</p><div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><span>{item.desk}</span><span className="text-slate-300">•</span><span className={`rounded-full px-2 py-0.5 font-bold ${item.status === 'Locked' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Scheduled' ? 'bg-blue-100 text-secondary' : item.status === 'Editing' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>{item.status}</span></div></div></div>)}</div></section>
              </aside>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
