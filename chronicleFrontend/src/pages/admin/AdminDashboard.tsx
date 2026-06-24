import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleDataTable } from '../../components/ArticleDataTable';
import { SkeletonBlock, SkeletonLine, SkeletonStatCard, SkeletonTable } from '../../components/Skeleton';
import { Icon } from '../../components/ui';
import { articles, categories, stats } from '../../data';
import { AdminLayout } from '../../layouts/AdminLayout';

type TimeRange = '7d' | '30d' | '90d' | '1y';

const pipelineStages = [
  { label: 'Drafts', count: 36, icon: 'edit_note', color: 'text-slate-500', bg: 'bg-slate-100', bar: 'bg-slate-400' },
  { label: 'In Review', count: 12, icon: 'rate_review', color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' },
  { label: 'Scheduled', count: 8, icon: 'schedule', color: 'text-secondary', bg: 'bg-blue-50', bar: 'bg-secondary' },
  { label: 'Published', count: 1482, icon: 'publish', color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
];

const trafficSources = [
  { source: 'Direct', pct: 38, icon: 'home' as const, color: 'bg-secondary' },
  { source: 'Social Media', pct: 27, icon: 'share' as const, color: 'bg-emerald-500' },
  { source: 'Search', pct: 20, icon: 'search' as const, color: 'bg-purple-500' },
  { source: 'Referral', pct: 10, icon: 'link' as const, color: 'bg-amber-500' },
  { source: 'Other', pct: 5, icon: 'more_horiz' as const, color: 'bg-slate-400' },
];

const snapshotData = [
  { label: 'Readers Online', value: '1,247', icon: 'online_prediction', color: 'bg-blue-50 text-secondary' },
  { label: 'Articles Today', value: '18', icon: 'today', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Breaking Stories', value: '3', icon: 'bolt', color: 'bg-red-50 text-red-600' },
  { label: 'Avg. Publish Time', value: '24m', icon: 'timer', color: 'bg-purple-50 text-purple-600' },
];

const topArticles = [
  { title: 'The Architecture of Truth', views: '284K', engagement: '8.4%', status: 'Published' as const },
  { title: 'The Sovereign Grid', views: '192K', engagement: '6.2%', status: 'Published' as const },
  { title: 'Campus Reimagined', views: '147K', engagement: '5.1%', status: 'Scheduled' as const },
  { title: 'Genetic Resilience', views: '98K', engagement: '4.7%', status: 'Published' as const },
];

const newsroomAlerts = [
  { label: 'SEO Watch', detail: '14 articles missing updated meta descriptions', tone: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'warning' },
  { label: 'Breaking Desk', detail: '3 active developing stories need live updates', tone: 'bg-red-50 text-red-700 border-red-200', icon: 'bolt' },
  { label: 'Revenue', detail: 'Homepage CTR up 6.1% after hero slot rotation', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'trending_up' },
];

const liveTrends = [
  { topic: 'Election Debate', delta: '+42%', desk: 'Politics' },
  { topic: 'Campus Reform', delta: '+28%', desk: 'Education' },
  { topic: 'Heatwave Response', delta: '+19%', desk: 'Climate' },
  { topic: 'AI Regulation', delta: '+16%', desk: 'Technology' },
];

const scheduleSnapshot = [
  { time: '08:00', title: 'Morning Briefing', desk: 'Front Page', status: 'Locked' },
  { time: '11:30', title: 'Market Pulse', desk: 'Business', status: 'Editing' },
  { time: '15:00', title: 'Campus Reimagined', desk: 'Education', status: 'Scheduled' },
  { time: '19:00', title: 'Election Debate Recap', desk: 'Politics', status: 'Awaiting Review' },
];

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    { label: 'Unique Readers', value: '842K', delta: '+14.8%', icon: 'groups' },
    { label: 'Avg. Session', value: '6m 42s', delta: '+2.1%', icon: 'schedule' },
    { label: 'Article Reads', value: '3.8M', delta: '+21.3%', icon: 'visibility' },
    { label: 'Newsletter CTR', value: '18.6%', delta: '+4.4%', icon: 'mark_email_read' },
  ];
  const traffic = [72, 58, 84, 66, 93, 78, 88];

  const recentActivity = [
    { action: 'Published', title: 'The Architecture of Truth', time: '2h ago', user: 'Julian' },
    { action: 'Scheduled', title: 'The Sovereign Grid', time: '4h ago', user: 'Eleanor' },
    { action: 'Submitted', title: 'Campus Reimagined', time: '6h ago', user: 'Marcus' },
    { action: 'Approved', title: 'Genetic Resilience', time: '8h ago', user: 'Sasha' },
  ];

  const maxTraffic = Math.max(...traffic);

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
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-6">
              <SkeletonLine width="200px" />
            </div>
            <div className="p-6">
              <SkeletonTable rows={3} />
            </div>
          </section>
        </div>
      ) : (
      <div className="space-y-10">

        {/* ── Section 1: Overview ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-white"><Icon name="analytics" /></span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary">Overview</h2>
              <p className="text-sm text-slate-500">Key metrics, readership, and publishing momentum</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
                <button key={range} className={`rounded-md px-4 py-2 text-sm font-bold transition ${timeRange === range ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-primary'}`} type="button" onClick={() => setTimeRange(range)}>{range}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 soft-shadow lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <Icon name="language" className="text-base text-slate-400" />
                <select className="bg-transparent font-semibold outline-none" defaultValue="Global Edition">
                  <option>Global Edition</option>
                  <option>Indonesia Edition</option>
                  <option>Campus Edition</option>
                </select>
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <Icon name="category" className="text-base text-slate-400" />
                <select className="bg-transparent font-semibold outline-none" defaultValue="All Desks">
                  <option>All Desks</option>
                  <option>Politics</option>
                  <option>Business</option>
                  <option>Technology</option>
                  <option>Education</option>
                </select>
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <Icon name="devices" className="text-base text-slate-400" />
                <select className="bg-transparent font-semibold outline-none" defaultValue="All Platforms">
                  <option>All Platforms</option>
                  <option>Web</option>
                  <option>Mobile</option>
                  <option>Newsletter</option>
                  <option>Social</option>
                </select>
              </label>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="rounded-full bg-emerald-50 px-3 py-2 font-bold text-emerald-700">Updated 2 min ago</span>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-bold text-primary transition hover:bg-slate-50" type="button">
                <Icon name="refresh" className="text-base" />Refresh
              </button>
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
            <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary">Executive Summary</h3>
                <p className="text-sm text-slate-500">Core publishing, audience, and newsroom health in one panel</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {newsroomAlerts.map((alert) => (
                  <div key={alert.label} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${alert.tone}`}>
                    <Icon name={alert.icon} className="text-sm" />{alert.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                      <p className="font-display mt-2 text-3xl font-bold text-primary">{stat.value}</p>
                      <p className="mt-1 text-sm font-bold text-secondary">{stat.delta}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-secondary"><Icon name={metric.icon} /></span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{metric.label}</p>
                        <p className="mt-1 text-lg font-bold text-primary">{metric.value}</p>
                        <p className="text-xs font-semibold text-emerald-600">{metric.delta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-lg font-bold text-primary">Today</h4>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live status</span>
                </div>
                <div className="space-y-3">
                  {snapshotData.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg bg-white p-3">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${item.color}`}><Icon name={item.icon} className="text-xl" /></span>
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                        <p className="text-lg font-bold text-primary">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Section 2: Editorial Pipeline ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-600 text-white"><Icon name="account_tree" /></span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary">Editorial Pipeline</h2>
              <p className="text-sm text-slate-500">Real-time view of content workflow from draft to publication</p>
            </div>
          </div>
          <div className="grid gap-0 md:grid-cols-4 md:gap-3 xl:gap-5">{pipelineStages.map((stage, i) => (
            <div key={stage.label} className="relative">
              <div className={`rounded-xl border ${stage.bg} border-slate-200 p-5 soft-shadow`}>
                <div className="flex items-center justify-between">
                  <span className={`grid h-10 w-10 place-items-center rounded-lg ${stage.bg} ${stage.color}`}><Icon name={stage.icon} className="text-xl" /></span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${stage.bar} !text-white`}>{stage.count}</span>
                </div>
                <p className="mt-4 text-sm font-bold uppercase tracking-wider text-slate-500">{stage.label}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className={`h-full rounded-full ${stage.bar}`} style={{ width: `${(stage.count / Math.max(...pipelineStages.map(s => s.count))) * 100}%` }} />
                </div>
              </div>
              {i < pipelineStages.length - 1 && (
                <div className="hidden md:absolute md:-right-2.5 md:top-1/2 md:z-10 md:flex md:-translate-y-1/2 md:items-center md:justify-center">
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm"><Icon name="chevron_right" className="text-lg" /></span>
                </div>
              )}
            </div>
          ))}</div>
        </div>

        {/* ── Section 3: Analytics ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-600 text-white"><Icon name="insights" /></span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary">Audience Analytics</h2>
              <p className="text-sm text-slate-500">Traffic trends, source breakdown, and category performance</p>
            </div>
          </div>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Weekly Traffic</h3>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Last 7 Days</span>
              </div>
              <div className="flex h-80 items-end gap-4 border-b border-slate-200 pb-4">{traffic.map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-3">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-secondary/80 to-secondary transition hover:from-secondary hover:to-secondary" style={{ height: `${(height / maxTraffic) * 100}%` }} />
                  <span className="text-xs font-bold text-slate-400">D{index + 1}</span>
                </div>
              ))}</div>
            </section>
            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <h3 className="mb-6 text-xl font-bold text-primary">Traffic Sources</h3>
              <div className="space-y-5">{trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name={source.icon} className="text-slate-500" />
                      <span className="text-sm font-semibold text-slate-700">{source.source}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{source.pct}%</span>
                  </div>
                  <div className="overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-3 rounded-full ${source.color}`} style={{ width: `${source.pct}%` }} />
                  </div>
                </div>
              ))}</div>
              <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-700">Total Traffic</span>
                <span className="font-bold text-primary">1.8M visits</span>
              </div>
            </section>
          </div>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">Category Momentum</h3>
                  <p className="text-sm text-slate-500">Coverage share and demand by desk category</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">4 tracked</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">{categories.slice(0, 4).map((category) => (
                <div key={category.name} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold text-primary">{category.name}</span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">{category.count} articles</span>
                  </div>
                  <div className="overflow-hidden rounded-full bg-slate-200"><div className={`h-2.5 rounded-full ${category.tone}`} style={{ width: `${(category.count / Math.max(...categories.map(c => c.count))) * 100}%` }} /></div>
                </div>
              ))}</div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Live Trends</h3>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">Live</span>
              </div>
              <div className="space-y-4">
                {liveTrends.map((trend, index) => (
                  <div key={trend.topic} className="flex items-start gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-sm font-bold text-slate-500">#{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-primary">{trend.topic}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 font-bold text-secondary">{trend.desk}</span>
                        <span className="font-bold text-emerald-600">{trend.delta}</span>
                      </div>
                    </div>
                    <Icon name="north_east" className="text-emerald-500" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ── Section 4: Content & Performance ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white"><Icon name="article" /></span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary">Content & Performance</h2>
              <p className="text-sm text-slate-500">Article repository and top-performing stories</p>
            </div>
          </div>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 p-6">
                <div>
                  <h3 className="text-xl font-bold text-primary">Content Repository</h3>
                  <p className="text-sm text-slate-500">Recent articles across all statuses</p>
                </div>
                <Link to="/admin/articles/new" className="rounded-lg bg-primary px-4 py-2 font-bold !text-white">+ New Article</Link>
              </div>
              <ArticleDataTable articles={articles} compact />
            </section>

            <aside className="space-y-6">
              <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-primary">Top Performing</h3>
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-400">This period</span>
                </div>
                <div className="space-y-4">{topArticles.map((article, i) => (
                  <div key={article.title} className="group flex items-start gap-4 rounded-lg p-3 transition hover:bg-slate-50">
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-500">#{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-primary">{article.title}</p>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Icon name="visibility" className="text-sm" />{article.views}</span>
                        <span className="flex items-center gap-1"><Icon name="trending_up" className="text-sm" />{article.engagement}</span>
                        <span className={`rounded-full px-2 py-0.5 font-bold ${article.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{article.status}</span>
                      </div>
                    </div>
                    <Icon name="chevron_right" className="mt-1.5 text-slate-300 opacity-0 transition group-hover:opacity-100" />
                  </div>
                ))}</div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-secondary"><Icon name="history" /></span>
                    <div>
                      <h3 className="text-xl font-bold text-primary">Recent Activity</h3>
                      <p className="text-sm text-slate-500">Latest editorial actions</p>
                    </div>
                  </div>
                  <Link className="text-sm font-bold text-secondary hover:underline" to="/admin/activity">View all</Link>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg p-3 transition hover:bg-slate-50">
                      <span className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-white ${item.action === 'Published' ? 'bg-emerald-500' : item.action === 'Scheduled' ? 'bg-secondary' : item.action === 'Submitted' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                        <Icon name={item.action === 'Published' ? 'publish' : item.action === 'Scheduled' ? 'schedule' : item.action === 'Submitted' ? 'rate_review' : 'check_circle'} className="text-lg" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-700"><span className="text-primary">{item.user}</span> {item.action.toLowerCase()} <span className="text-primary">{item.title}</span></p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-secondary shadow-sm"><Icon name="campaign" /></span>
                    <p className="text-sm text-slate-600"><span className="font-bold text-primary">3 articles</span> need editorial review. <Link className="font-bold text-secondary hover:underline" to="/admin/content">Go to Content →</Link></p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-primary">Schedule Snapshot</h3>
                    <p className="text-sm text-slate-500">Upcoming publishing slots for today</p>
                  </div>
                  <Link className="text-sm font-bold text-secondary hover:underline" to="/admin/content">Open editorial</Link>
                </div>
                <div className="space-y-3">
                  {scheduleSnapshot.map((item) => (
                    <div key={`${item.time}-${item.title}`} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <div className="min-w-[58px] rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Slot</p>
                        <p className="text-sm font-bold text-primary">{item.time}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-primary">{item.title}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span>{item.desk}</span>
                          <span className="text-slate-300">•</span>
                          <span className={`rounded-full px-2 py-0.5 font-bold ${item.status === 'Locked' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Scheduled' ? 'bg-blue-100 text-secondary' : item.status === 'Editing' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>{item.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
      )}
    </AdminLayout>
  );
}
