import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { SkeletonBlock, SkeletonLine } from '../../components/Skeleton';
import { Field, Icon } from '../../components/ui';
import { articles } from '../../data';

type OptTab = 'seo' | 'content' | 'ai';
const optTabs: { id: OptTab; label: string; icon: string }[] = [
  { id: 'seo', label: 'SEO & Search', icon: 'travel_explore' },
  { id: 'content', label: 'Content Quality', icon: 'description' },
  { id: 'ai', label: 'AI Tools & Safety', icon: 'auto_fix_high' },
];

type ScoreBarProps = { label: string; value: number; max?: number; color?: string };
function ScoreBar({ label, value, max = 100, color = 'bg-secondary' }: ScoreBarProps) {
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm font-bold text-slate-600">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-2.5 rounded-full transition-all ${color}`} style={{ width: `${pct * 100}%` }} />
      </div>
      <span className="w-10 text-right text-sm font-bold text-slate-700">{value}{max > 1 && `/${max}`}</span>
    </div>
  );
}

type GaugeProps = { score: number; label: string; size?: number };
function Gauge({ score, label, size = 100 }: GaugeProps) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? 'stroke-emerald-500' : score >= 50 ? 'stroke-amber-500' : 'stroke-red-500';
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={color} />
      </svg>
      <span className="absolute mt-7 text-2xl font-bold text-primary">{score}</span>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  );
}

const providers = ['OpenAI', 'Gemini', 'Azure OpenAI', 'Custom API Endpoint'];
const rules = ['Hindari clickbait berlebihan', 'Hindari bahasa tidak baku', 'Hindari opini pada hard news', 'Wajib cek typo', 'Wajib cek struktur 5W+1H', 'Wajib cek judul dan ringkasan'];
const safeguards = ['AI hanya memberi saran, tidak mengubah artikel otomatis', 'Editor wajib approve setiap perubahan', 'Simpan riwayat koreksi AI', 'Tampilkan before/after sebelum apply', 'AI tidak boleh auto-publish'];

export function AdminOptimizationHub() {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<OptTab>('seo');
  const [seoScore] = useState(78);
  const [readabilityScore] = useState(68);
  const [keywordDensity] = useState(2.4);
  const [currentKeyword, setCurrentKeyword] = useState('digital transformation');
  const [socialTab, setSocialTab] = useState<'facebook' | 'twitter'>('facebook');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const scoreFactors = [
    { label: 'Meta Tags', value: 90, color: 'bg-emerald-500' },
    { label: 'Readability', value: readabilityScore, color: readabilityScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500' },
    { label: 'Keyword Usage', value: 72, color: 'bg-secondary' },
    { label: 'Internal Links', value: 60, color: 'bg-amber-500' },
    { label: 'Image Alt Text', value: 45, color: 'bg-red-500' },
    { label: 'Schema Markup', value: 100, color: 'bg-emerald-500' },
  ];

  const schemaItems = [
    { name: 'Article', status: 'active' as const },
    { name: 'NewsArticle', status: 'active' as const },
    { name: 'BreadcrumbList', status: 'active' as const },
    { name: 'Organization', status: 'active' as const },
    { name: 'FAQ', status: 'missing' as const },
    { name: 'VideoObject', status: 'missing' as const },
  ];

  const linkData = { internalOk: 42, internalWarn: 3, externalOk: 18, externalWarn: 2, broken: 1 };
  const imageData = { total: 24, withAlt: 18, missingAlt: 6, oversized: 3 };

  const readabilityLabel = readabilityScore >= 80 ? 'Mudah dibaca' : readabilityScore >= 60 ? 'Cukup mudah' : readabilityScore >= 40 ? 'Agak sulit' : 'Sulit';

  return (
    <AdminLayout title="Optimization">
      {loading ? (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <SkeletonLine width="320px" />
              <SkeletonLine width="500px" />
            </div>
            <SkeletonBlock className="h-12 w-44" />
          </div>
          <SkeletonBlock className="h-[260px]" />
          <SkeletonBlock className="h-12" />
          <div className="space-y-8">
            <SkeletonBlock className="h-[520px]" />
            <SkeletonBlock className="h-[360px]" />
          </div>
        </div>
      ) : (
      <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-primary">Optimization Center</h1>
          <p className="mt-2 max-w-3xl text-slate-600">SEO, content quality, AI/KBBI editorial correction, and performance analytics in one quality-control command center.</p>
        </div>
        <button className="w-fit rounded-lg bg-primary px-5 py-3 font-bold !text-white" type="button">Save All Settings</button>
      </div>

      <div className="min-w-0 space-y-6">
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
          {optTabs.map((tab) => (
            <button key={tab.id} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition ${currentTab === tab.id ? 'bg-white !text-primary shadow-sm' : 'text-slate-500 hover:text-primary'}`} type="button" onClick={() => setCurrentTab(tab.id)}>
              <Icon name={tab.icon} className="text-lg" />{tab.label}
            </button>
          ))}
        </div>

          {currentTab === 'seo' && <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-white"><Icon name="travel_explore" /></span>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold text-primary">Search Visibility</h2>
                <p className="text-sm text-slate-500">How your site appears in search engines and social platforms</p>
              </div>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Gauge score={seoScore} label="SEO Score" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Overall Optimization</p>
                    <p className="mt-1 max-w-md text-sm text-slate-600">Overall content optimization score across all factors, with breakdown visible in each tab.</p>
                  </div>
                </div>
                <div className="grid w-full gap-2 lg:max-w-md">
                  {scoreFactors.map((factor) => <ScoreBar key={factor.label} {...factor} />)}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary">SEO Management</h3>
                  <p className="mt-1 text-sm text-slate-600">Meta defaults, keyword analysis, structured data, and link health.</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">Auto-scan enabled</span>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <Field label="Default Meta Title" placeholder="Chronicle News — Independent Journalism" icon="title" />
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Meta Description</span>
                    <textarea className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 outline-none focus:border-secondary" rows={3} defaultValue="Independent journalism for the informed reader. National news, in-depth analysis, and editorial integrity." />
                    <p className="mt-1 text-right text-xs text-slate-400">148 characters</p>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Focus Keyword</span>
                    <div className="relative">
                      <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input className="w-full rounded-lg border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 outline-none focus:border-secondary" value={currentKeyword} onChange={(e) => setCurrentKeyword(e.target.value)} placeholder="Enter target keyword..." />
                    </div>
                  </label>
                </div>
                <div className="space-y-4 rounded-xl bg-blue-50 p-5">
                  <h4 className="font-bold text-primary">Keyword Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Keyword</p><p className="mt-1 font-bold text-primary">{currentKeyword}</p></div>
                    <div className="rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Density</p><p className="mt-1 font-bold text-primary">{keywordDensity}% <span className="text-sm font-normal text-slate-500">(target: 2-3%)</span></p></div>
                    <div className="rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Title match</p><p className="mt-1 font-bold text-emerald-600">Yes</p></div>
                    <div className="rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">H1 match</p><p className="mt-1 font-bold text-emerald-600">Yes</p></div>
                    <div className="rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Meta Desc.</p><p className="mt-1 font-bold text-emerald-600">Present</p></div>
                    <div className="rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">URL slug</p><p className="mt-1 font-bold text-amber-600">Missing</p></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between"><h4 className="font-bold text-primary">Structured Data</h4><button className="text-sm font-bold text-secondary hover:underline" type="button">Validate All</button></div>
                  <div className="grid grid-cols-2 gap-3">
                    {schemaItems.map((item) => (
                      <div key={item.name} className={`flex items-center justify-between rounded-lg px-4 py-3 ${item.status === 'active' ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                        <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${item.status === 'active' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-300 text-slate-600'}`}>{item.status === 'active' ? '✓ Active' : '○ Add'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between"><h4 className="font-bold text-primary">Link Health</h4><button className="text-sm font-bold text-secondary hover:underline" type="button">Re-check</button></div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3"><span className="text-sm font-semibold text-slate-700"><Icon name="link" className="mr-2 align-middle text-emerald-600" />Internal links</span><span className="font-bold text-emerald-700">{linkData.internalOk} ok<span className="ml-2 text-amber-600">+{linkData.internalWarn} warn</span></span></div>
                    <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3"><span className="text-sm font-semibold text-slate-700"><Icon name="open_in_new" className="mr-2 align-middle text-emerald-600" />External links</span><span className="font-bold text-emerald-700">{linkData.externalOk} ok<span className="ml-2 text-amber-600">+{linkData.externalWarn} warn</span></span></div>
                    <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3"><span className="text-sm font-semibold text-slate-700"><Icon name="link_off" className="mr-2 align-middle text-red-500" />Broken links</span><span className="font-bold text-red-600">{linkData.broken} broken</span></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary">Social Preview</h3>
                  <p className="mt-1 text-sm text-slate-600">Facebook OG and Twitter Card preview for article sharing.</p>
                </div>
                <div className="flex gap-2">
                  <button className={`rounded-lg px-4 py-2 text-sm font-bold ${socialTab === 'facebook' ? 'bg-primary !text-white' : 'bg-slate-100 text-slate-600'}`} type="button" onClick={() => setSocialTab('facebook')}>Facebook</button>
                  <button className={`rounded-lg px-4 py-2 text-sm font-bold ${socialTab === 'twitter' ? 'bg-primary !text-white' : 'bg-slate-100 text-slate-600'}`} type="button" onClick={() => setSocialTab('twitter')}>Twitter / X</button>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-4">
                  <Field label="OG Title" placeholder="Chronicle News — Independent Journalism" icon="title" />
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">OG Description</span>
                    <textarea className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 outline-none focus:border-secondary" rows={2} defaultValue="Independent journalism for the informed reader." />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="OG Image URL" placeholder="https://chronicle.news/og-image.jpg" icon="image" />
                    <label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Twitter Card</span><select className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" defaultValue="summary_large_image"><option value="summary">Summary</option><option value="summary_large_image">Summary Large Image</option><option value="player">Player</option></select></label>
                  </div>
                </div>
                <div className="min-h-[200px] rounded-xl border border-slate-200 bg-slate-50 p-4">
                  {socialTab === 'facebook' ? (
                    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                      <div className="aspect-[1.91/1] bg-slate-200"><img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85" alt="" /></div>
                      <div className="p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">chronicle.news</p>
                        <p className="line-clamp-2 text-sm font-semibold text-primary">Chronicle News — Independent Journalism</p>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">Independent journalism for the informed reader.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                      <div className="aspect-[2/1] bg-slate-200"><img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85" alt="" /></div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-primary">Chronicle News — Independent Journalism</p>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">Independent journalism for the informed reader.</p>
                        <p className="mt-1 text-[10px] text-slate-400">chronicle.news</p>
                      </div>
                    </div>
                  )}
                  <p className="mt-2 text-center text-xs text-slate-400">Live preview — updates as you type</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary">Sitemap & Crawl</h3>
                  <p className="mt-1 text-sm text-slate-600">XML sitemap, robots.txt, and crawl settings for search engine bots.</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">Indexed: 1,482 pages</span>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div><p className="font-bold text-primary">XML Sitemap</p><p className="text-sm text-slate-500">sitemap.xml</p></div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Auto</span>
                      <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-primary" type="button">View</button>
                      <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-primary" type="button">Regenerate</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 p-4 text-center"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Articles</p><p className="mt-1 font-display text-3xl font-bold text-primary">1,482</p></div>
                    <div className="rounded-lg border border-slate-200 p-4 text-center"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Categories</p><p className="mt-1 font-display text-3xl font-bold text-primary">12</p></div>
                    <div className="rounded-lg border border-slate-200 p-4 text-center"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Authors</p><p className="mt-1 font-display text-3xl font-bold text-primary">24</p></div>
                    <div className="rounded-lg border border-slate-200 p-4 text-center"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tags</p><p className="mt-1 font-display text-3xl font-bold text-primary">187</p></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-slate-600"><span>robots.txt</span><button className="rounded bg-slate-100 px-3 py-1 text-xs font-bold text-primary" type="button">Reset to default</button></span>
                    <textarea className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none focus:border-secondary" rows={6} defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://chronicle.news/sitemap.xml`} />
                  </label>
                  <div className="space-y-3">
                    <h4 className="font-bold text-primary">Crawl Settings</h4>
                    <label className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"><span className="text-sm font-semibold text-slate-700">Enable crawling</span><span className="h-6 w-11 rounded-full bg-secondary p-1"><span className="block h-4 w-4 translate-x-5 rounded-full bg-white" /></span></label>
                    <label className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"><span className="text-sm font-semibold text-slate-700">Index article pages</span><span className="h-6 w-11 rounded-full bg-secondary p-1"><span className="block h-4 w-4 translate-x-5 rounded-full bg-white" /></span></label>
                    <label className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"><span className="text-sm font-semibold text-slate-700">Index category pages</span><span className="h-6 w-11 rounded-full bg-secondary p-1"><span className="block h-4 w-4 translate-x-5 rounded-full bg-white" /></span></label>
                    <label className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"><span className="text-sm font-semibold text-slate-700">Noindex author pages</span><span className="h-6 w-11 rounded-full bg-slate-300 p-1"><span className="block h-4 w-4 rounded-full bg-white" /></span></label>
                  </div>
                </div>
              </div>
            </section>
          </div>}

          {currentTab === 'content' && <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white"><Icon name="description" /></span>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold text-primary">Content Quality</h2>
                <p className="text-sm text-slate-500">Article-level quality checks: readability, links, images, and originality</p>
              </div>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="grid gap-6 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-primary">Readability</h4>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${readabilityScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{readabilityLabel}</span>
                  </div>
                  <div className="mt-5 flex items-end gap-3">
                    <span className="font-display text-5xl font-bold text-primary">{readabilityScore}</span>
                    <span className="mb-1 text-sm font-bold text-slate-500">/ 100</span>
                  </div>
                  <div className="mt-3 overflow-hidden rounded-full bg-slate-200"><div className={`h-3 rounded-full ${readabilityScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${readabilityScore}%` }} /></div>
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span className="text-slate-600">Avg. sentence</span><span className="font-bold text-slate-700">14.2 words</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-600">Avg. word len</span><span className="font-bold text-slate-700">5.8 chars</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-600">Passive voice</span><span className="font-bold text-amber-600">12%</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-600">Subheadings</span><span className="font-bold text-slate-700">8 sections</span></div>
                  </div>
                  <button className="mt-5 w-full rounded-lg bg-white py-2 text-sm font-bold text-primary shadow-sm" type="button">Full Analysis</button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="mb-4 font-bold text-primary">Link Checker</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-white p-3"><span className="text-sm font-semibold text-slate-700">Internal</span><span className="font-bold text-emerald-600">{linkData.internalOk} ✓</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-white p-3"><span className="text-sm font-semibold text-slate-700">External</span><span className="font-bold text-emerald-600">{linkData.externalOk} ✓</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-red-50 p-3"><span className="text-sm font-semibold text-slate-700">Broken</span><span className="font-bold text-red-600">{linkData.broken} ⚠</span></div>
                  </div>
                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-bold text-primary shadow-sm" type="button"><Icon name="refresh" className="text-base" /> Re-check All Links</button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="mb-4 font-bold text-primary">Image Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-white p-3"><span className="text-sm font-semibold text-slate-700">Total images</span><span className="font-bold text-slate-700">{imageData.total}</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3"><span className="text-sm font-semibold text-slate-700">With alt text</span><span className="font-bold text-emerald-600">{imageData.withAlt}</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3"><span className="text-sm font-semibold text-slate-700">Missing alt</span><span className="font-bold text-amber-600">{imageData.missingAlt}</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3"><span className="text-sm font-semibold text-slate-700">Oversized</span><span className="font-bold text-amber-600">{imageData.oversized}</span></div>
                  </div>
                  <button className="mt-4 w-full rounded-lg bg-white py-2 text-sm font-bold text-primary shadow-sm" type="button">Optimize Images</button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="mb-4 font-bold text-primary">Originality</h4>
                  <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4">
                    <Icon name="verified" className="text-3xl text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-700">No issues found</p>
                      <p className="text-sm text-slate-600">Last checked: today</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span className="text-slate-600">Plagiarism check</span><span className="font-bold text-emerald-600">Passed</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-600">AI-generated score</span><span className="font-bold text-slate-700">3%</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-600">Fact-check status</span><span className="font-bold text-amber-600">Pending (2)</span></div>
                  </div>
                  <button className="mt-4 w-full rounded-lg bg-white py-2 text-sm font-bold text-primary shadow-sm" type="button">Run Full Check</button>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary">Content Performance</h3>
                  <p className="mt-1 text-sm text-slate-600">Top articles by engagement and optimization score.</p>
                </div>
                <select className="rounded-lg border border-slate-200 p-2 text-sm outline-none" defaultValue="7d">
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="pb-4 pr-4">Article</th>
                      <th className="pb-4 pr-4">Category</th>
                      <th className="pb-4 pr-4">Views</th>
                      <th className="pb-4 pr-4">SEO Score</th>
                      <th className="pb-4 pr-4">Readability</th>
                      <th className="pb-4 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.slice(0, 4).map((article) => (
                      <tr key={article.slug} className="border-b border-slate-100">
                        <td className="py-4 pr-4">
                          <p className="font-semibold text-primary">{article.title}</p>
                        </td>
                        <td className="py-4 pr-4 text-slate-600">{article.category}</td>
                        <td className="py-4 pr-4 font-bold text-slate-700">{article.views}</td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${seoScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{seoScore}</span></td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${readabilityScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{readabilityScore}</span></td>
                        <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${article.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{article.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>}

          {currentTab === 'ai' && <div className="space-y-5">
            <section className="rounded-xl border border-purple-100 bg-purple-50 p-6 soft-shadow">
              <div className="mb-5">
                <h3 className="font-display text-2xl font-bold text-primary">AI & KBBI Settings</h3>
                <p className="mt-1 text-sm text-slate-600">Configure provider, model, KBBI rules, and editor approval safety.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <label className="block"><span className="mb-2 block font-bold text-slate-600">Provider</span><select className="w-full rounded-lg border border-purple-100 bg-white p-3 outline-none focus:border-secondary" defaultValue="OpenAI">{providers.map((provider) => <option key={provider}>{provider}</option>)}</select></label>
                <Field label="Model Name" placeholder="gpt-4.1-mini / gemini-1.5-pro" icon="psychology" />
                <Field label="Base URL" placeholder="https://api.openai.com/v1" icon="link" />
                <Field label="API Key" placeholder="Stored securely on backend" icon="key" type="password" />
                <label className="block"><span className="mb-2 block font-bold text-slate-600">Temperature</span><input className="w-full rounded-lg border border-purple-100 bg-white p-3 outline-none focus:border-secondary" defaultValue="0.2" type="number" step="0.1" /></label>
                <label className="block"><span className="mb-2 block font-bold text-slate-600">Max Tokens</span><input className="w-full rounded-lg border border-purple-100 bg-white p-3 outline-none focus:border-secondary" defaultValue="1200" type="number" /></label>
              </div>
              <label className="mt-5 block"><span className="mb-2 block font-bold text-slate-600">System Prompt Editorial</span><textarea className="w-full rounded-lg border border-purple-100 bg-white p-4 outline-none focus:border-secondary" rows={4} defaultValue="Anda adalah asisten editor berita berbahasa Indonesia. Koreksi ejaan sesuai KBBI, perbaiki tata bahasa, pertahankan gaya jurnalistik formal, netral, objektif, ringkas, dan jangan mengubah fakta tanpa catatan." /></label>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
                <h3 className="text-lg font-bold text-primary">Editorial Language Rules</h3>
                <div className="mt-5 grid gap-4">
                  <label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-500">Bahasa Utama</span><input className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" defaultValue="Bahasa Indonesia" /></label>
                  <label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-500">Standar Bahasa</span><input className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" defaultValue="KBBI" /></label>
                  <label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-500">Gaya Penulisan</span><input className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" defaultValue="Jurnalistik formal" /></label>
                  <label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-500">Nada</span><input className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" defaultValue="Netral, objektif, ringkas" /></label>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
                <h3 className="mb-5 text-lg font-bold text-primary">Rules Checklist</h3>
                {rules.map((rule, index) => (
                  <div key={rule} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
                    <span className="font-semibold text-slate-700">{rule}</span>
                    <span className={`h-6 w-11 rounded-full p-1 ${index < 5 ? 'bg-purple-600' : 'bg-slate-300'}`}>
                      <span className={`block h-4 w-4 rounded-full bg-white transition ${index < 5 ? 'translate-x-5' : ''}`} />
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Section</p>
                  <h3 className="font-display text-2xl font-bold text-primary">Safety & Guardrails</h3>
                  <p className="mt-1 text-sm text-slate-600">Safeguards to ensure AI-assisted edits never bypass human judgment.</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-700">Editor approval required</span>
              </div>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-700 mx-auto"><Icon name="rate_review" className="text-2xl" /></span>
                    <h4 className="mt-4 font-bold text-primary">Awaiting Review</h4>
                    <p className="mt-1 text-3xl font-bold text-amber-600">3</p>
                    <p className="text-sm text-slate-500">articles pending editor review</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-blue-700 mx-auto"><Icon name="edit_note" className="text-2xl" /></span>
                    <h4 className="mt-4 font-bold text-primary">AI Suggestions</h4>
                    <p className="mt-1 text-3xl font-bold text-secondary">12</p>
                    <p className="text-sm text-slate-500">corrections proposed today</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700 mx-auto"><Icon name="history" className="text-2xl" /></span>
                    <h4 className="mt-4 font-bold text-primary">Change History</h4>
                    <p className="mt-1 text-3xl font-bold text-emerald-600">247</p>
                    <p className="text-sm text-slate-500">total tracked corrections</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-bold text-primary">Approval Rules</h4>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{safeguards.length} active</span>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {safeguards.map((item) => (
                      <div key={item} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="check_circle" className="text-sm" /></span>
                        <p className="text-sm leading-6 text-slate-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>}

        </div>
      </>
      )}
    </AdminLayout>
  );
}
