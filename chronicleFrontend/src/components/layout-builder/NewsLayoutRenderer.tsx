import { Link } from 'react-router-dom';
import type { Article } from '../../data';
import type { NewsLayoutSection, NewsLayoutTemplate } from '../../data/layouts';
import { Icon } from '../ui';

type RendererProps = {
  template: NewsLayoutTemplate;
  articles: Article[];
  previewMode?: 'mobile' | 'md' | 'desktop';
};

function parseViews(value: string) {
  if (value.endsWith('K')) return Number(value.replace('K', '')) * 1000;
  return Number(value) || 0;
}

function getSectionArticles(section: NewsLayoutSection, articles: Article[]) {
  const filtered = articles.filter((article) => {
    const categoryMatches = section.dataSource.category === 'All' || article.category === section.dataSource.category;
    const statusMatches = section.dataSource.status === 'All' || article.status === section.dataSource.status;
    const featuredMatches = !section.dataSource.featuredOnly || Boolean(article.featured);

    return categoryMatches && statusMatches && featuredMatches;
  });

  const sorted = [...filtered].sort((left, right) => {
    if (section.dataSource.sortBy === 'popular') return parseViews(right.views) - parseViews(left.views);
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });

  return sorted.slice(0, section.dataSource.limit);
}

function gridClass(section: NewsLayoutSection, previewMode: RendererProps['previewMode']) {
  if (previewMode === 'mobile') return 'grid-cols-1';
  if (previewMode === 'md') return section.responsive.md === '3' ? 'grid-cols-3' : section.responsive.md === '2' ? 'grid-cols-2' : 'grid-cols-1';
  if (section.responsive.desktop === '4') return 'grid-cols-4';
  if (section.responsive.desktop === '3') return 'grid-cols-3';
  return 'grid-cols-2';
}

function ArticleMeta({ article }: { article: Article }) {
  return <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"><span className="text-secondary">{article.category}</span><span>·</span><span>{article.date}</span></div>;
}

function EmptyBlock({ section }: { section: NewsLayoutSection }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><Icon name="dynamic_feed" className="text-4xl text-slate-300" /><p className="mt-3 font-bold text-primary">No articles matched “{section.title}”</p><p className="mt-1 text-sm text-slate-500">Try broadening category, status, featured, or limit settings.</p></div>;
}

function HeroBlock({ section, items }: { section: NewsLayoutSection; items: Article[] }) {
  const article = items[0];
  if (!article) return <EmptyBlock section={section} />;

  return <Link to={`/news/${article.slug}`} className="group grid overflow-hidden rounded-2xl bg-primary text-white editorial-shadow lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]"><div className="min-h-[360px] overflow-hidden"><img className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" src={article.image} alt="" /></div><div className="flex flex-col justify-center p-8"><span className="mb-4 w-fit rounded bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">{section.title}</span><h3 className="font-display text-4xl font-bold leading-tight lg:text-5xl">{article.title}</h3><p className="mt-5 line-clamp-3 leading-8 text-white/75">{article.summary}</p><p className="mt-6 text-sm font-bold text-white/60">{article.author} · {article.readTime}</p></div></Link>;
}

function GridBlock({ section, items, previewMode }: { section: NewsLayoutSection; items: Article[]; previewMode?: RendererProps['previewMode'] }) {
  if (!items.length) return <EmptyBlock section={section} />;

  return <div className={`grid gap-5 ${gridClass(section, previewMode)}`}>{items.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"><img className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105" src={article.image} alt="" /><div className="p-5"><ArticleMeta article={article} /><h3 className="font-display mt-3 text-2xl font-semibold leading-tight text-primary group-hover:text-secondary">{article.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{article.summary}</p></div></Link>)}</div>;
}

function ListBlock({ section, items }: { section: NewsLayoutSection; items: Article[] }) {
  if (!items.length) return <EmptyBlock section={section} />;

  return <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">{items.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="grid gap-4 p-4 transition hover:bg-slate-50 md:grid-cols-[140px_minmax(0,1fr)]"><img className="aspect-video rounded-lg object-cover" src={article.image} alt="" /><div><ArticleMeta article={article} /><h3 className="font-display mt-2 text-xl font-semibold text-primary">{article.title}</h3><p className="mt-1 line-clamp-2 text-sm text-slate-600">{article.summary}</p></div></Link>)}</div>;
}

function TableBlock({ section, items }: { section: NewsLayoutSection; items: Article[] }) {
  if (!items.length) return <EmptyBlock section={section} />;

  return <div className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500"><tr><th className="px-5 py-4">Title</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Views</th></tr></thead><tbody className="divide-y divide-slate-200">{items.map((article) => <tr key={article.slug}><td className="px-5 py-4"><Link className="font-bold text-primary hover:text-secondary" to={`/news/${article.slug}`}>{article.title}</Link><p className="text-sm text-slate-500">{article.author} · {article.date}</p></td><td className="px-5 py-4 text-slate-600">{article.category}</td><td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-secondary">{article.status}</span></td><td className="px-5 py-4 text-right font-bold text-primary">{article.views}</td></tr>)}</tbody></table></div></div>;
}

function FeatureSplitBlock({ section, items }: { section: NewsLayoutSection; items: Article[] }) {
  if (!items.length) return <EmptyBlock section={section} />;
  const [lead, ...rest] = items;

  return <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]"><Link to={`/news/${lead.slug}`} className="group overflow-hidden rounded-xl bg-white soft-shadow"><img className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" src={lead.image} alt="" /><div className="p-6"><ArticleMeta article={lead} /><h3 className="font-display mt-3 text-3xl font-bold text-primary group-hover:text-secondary">{lead.title}</h3><p className="mt-3 leading-7 text-slate-600">{lead.summary}</p></div></Link><div className="space-y-4">{rest.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-secondary"><ArticleMeta article={article} /><h4 className="font-display mt-2 text-xl font-semibold text-primary">{article.title}</h4></Link>)}</div></div>;
}

function CarouselBlock({ section, items }: { section: NewsLayoutSection; items: Article[] }) {
  if (!items.length) return <EmptyBlock section={section} />;

  return <div className="flex gap-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 snap-x snap-mandatory">{items.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="group min-w-[280px] flex-1 snap-start overflow-hidden rounded-xl bg-white soft-shadow md:min-w-[320px]"><img className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" src={article.image} alt="" /><div className="p-5"><ArticleMeta article={article} /><h3 className="font-display mt-2 text-xl font-semibold leading-tight text-primary group-hover:text-secondary">{article.title}</h3></div></Link>)}</div>;
}

function MagazineCoverBlock({ section, items }: { section: NewsLayoutSection; items: Article[] }) {
  if (!items.length) return <EmptyBlock section={section} />;
  const lead = items[0];
  const rest = items.slice(1, 3);

  return <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]"><Link to={`/news/${lead.slug}`} className="group relative overflow-hidden rounded-xl bg-primary text-white"><img className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" src={lead.image} alt="" /><div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" /><div className="relative flex h-full min-h-[440px] flex-col justify-end p-8"><span className="mb-3 w-fit border border-white/40 px-3 py-1 text-xs font-bold uppercase tracking-widest">{section.title}</span><h3 className="font-display text-4xl font-bold leading-tight">{lead.title}</h3><p className="mt-4 line-clamp-3 text-white/75">{lead.summary}</p><p className="mt-5 text-sm font-bold text-white/60">{lead.author} · {lead.date}</p></div></Link><div className="space-y-4">{rest.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="group block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-secondary"><span className="text-xs font-bold uppercase tracking-widest text-secondary">Inside</span><h4 className="font-display mt-2 text-2xl font-semibold leading-tight text-primary group-hover:text-secondary">{article.title}</h4><p className="mt-2 line-clamp-2 text-sm text-slate-600">{article.summary}</p></Link>)}</div></div>;
}

function SidebarFeaturedBlock({ section, items }: { section: NewsLayoutSection; items: Article[] }) {
  if (!items.length) return <EmptyBlock section={section} />;
  const lead = items[0];
  const rest = items.slice(1);

  return <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.6fr)]"><Link to={`/news/${lead.slug}`} className="group overflow-hidden rounded-2xl bg-white soft-shadow"><img className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105" src={lead.image} alt="" /><div className="p-6"><ArticleMeta article={lead} /><h3 className="font-display mt-3 text-3xl font-bold text-primary group-hover:text-secondary">{lead.title}</h3><p className="mt-3 leading-7 text-slate-600">{lead.summary}</p></div></Link><ol className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">{rest.map((article, index) => <li key={article.slug}><Link to={`/news/${article.slug}`} className="group flex gap-4 rounded-lg p-3 transition hover:bg-white"><span className="font-display text-3xl font-bold text-slate-300 transition group-hover:text-secondary">{String(index + 1).padStart(2, '0')}</span><div><ArticleMeta article={article} /><h4 className="font-display mt-1 text-lg font-semibold leading-tight text-primary group-hover:text-secondary">{article.title}</h4></div></Link></li>)}</ol></div>;
}

function QuoteSpotlightBlock({ section, items }: { section: NewsLayoutSection; items: Article[] }) {
  const article = items[0];
  if (!article) return <EmptyBlock section={section} />;
  const quote = `“${article.summary}”`;

  return <div className="grid gap-6 overflow-hidden rounded-2xl bg-primary text-white editorial-shadow lg:grid-cols-2"><div className="flex flex-col justify-center p-10"><span className="mb-4 w-fit rounded bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">{section.title}</span><blockquote className="font-display text-3xl font-semibold leading-tight italic">“{article.title}”</blockquote><p className="mt-6 text-sm font-bold text-white/60">{article.author} · {article.readTime}</p><Link to={`/news/${article.slug}`} className="mt-8 inline-flex w-fit rounded-lg bg-secondary px-6 py-3 font-bold !text-white transition hover:bg-blue-500">Read Perspective</Link></div><div className="relative min-h-[280px]"><img className="absolute inset-0 h-full w-full object-cover opacity-90" src={article.image} alt="" /><div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/40" /></div><div className="sr-only">{quote}</div></div>;
}

function MultimediaStripBlock({ section, items }: { section: NewsLayoutSection; items: Article[] }) {
  if (!items.length) return <EmptyBlock section={section} />;

  return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{items.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="group relative overflow-hidden rounded-xl bg-primary text-white"><img className="aspect-[4/3] w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" src={article.image} alt="" /><div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" /><div className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-secondary text-white"><Icon name="play_arrow" /></div><div className="absolute bottom-0 left-0 p-5"><span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">{article.category}</span><h4 className="font-display mt-2 text-lg font-semibold leading-tight">{article.title}</h4></div></Link>)}</div>;
}

function SectionBlock({ section, items, previewMode }: { section: NewsLayoutSection; items: Article[]; previewMode?: RendererProps['previewMode'] }) {
  if (section.component === 'hero') return <HeroBlock section={section} items={items} />;
  if (section.component === 'grid') return <GridBlock section={section} items={items} previewMode={previewMode} />;
  if (section.component === 'list') return <ListBlock section={section} items={items} />;
  if (section.component === 'table') return <TableBlock section={section} items={items} />;
  if (section.component === 'featureSplit') return <FeatureSplitBlock section={section} items={items} />;
  if (section.component === 'carousel') return <CarouselBlock section={section} items={items} />;
  if (section.component === 'magazineCover') return <MagazineCoverBlock section={section} items={items} />;
  if (section.component === 'sidebarFeatured') return <SidebarFeaturedBlock section={section} items={items} />;
  if (section.component === 'quoteSpotlight') return <QuoteSpotlightBlock section={section} items={items} />;
  return <MultimediaStripBlock section={section} items={items} />;
}

export function NewsLayoutRenderer({ template, articles, previewMode = 'desktop' }: RendererProps) {
  return <div className="space-y-10">{template.sections.map((section) => { const items = getSectionArticles(section, articles); return <section key={section.id}><div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">{section.component}</p><h2 className="font-display text-3xl font-bold text-primary">{section.title}</h2></div><p className="text-sm font-semibold text-slate-500">Auto-filled: {items.length}/{section.dataSource.limit}</p></div><SectionBlock section={section} items={items} previewMode={previewMode} /></section>; })}</div>;
}
