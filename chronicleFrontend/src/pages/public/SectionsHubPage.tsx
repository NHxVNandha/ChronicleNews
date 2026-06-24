import { Link } from 'react-router-dom';
import { categories } from '../../data';
import { toSlug, topicList } from '../../config/navigation';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function SectionsHubPage() {
  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        <section className="mb-10 rounded-2xl bg-primary p-8 text-white editorial-shadow md:p-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">Sections</p>
          <h1 className="font-display max-w-4xl text-5xl font-bold md:text-6xl">Categories, topics, and regional reporting in one newsroom map.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">Browse Chronicle by editorial desk, issue topic, or regional coverage without jumping across separate menus.</p>
        </section>
        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-slate-200 pb-4">
          {['Categories', 'Topics', 'Regional'].map((item, index) => <a key={item} className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold ${index === 0 ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-blue-50'}`} href={`#${toSlug(item)}`}>{item}</a>)}
        </div>
        <section id="categories" className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">{categories.map((category) => <article key={category.name} className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow"><div className={`mb-5 h-2 w-14 rounded-full ${category.tone}`} /><h2 className="font-display text-2xl font-bold text-primary">{category.name}</h2><p className="mt-3 leading-7 text-slate-600">{category.description}</p><p className="mt-5 font-bold text-secondary">{category.count} articles</p></article>)}</section>
        <section id="topics" className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 soft-shadow"><h2 className="font-display text-3xl font-bold text-primary">Popular Topics</h2><div className="mt-5 flex flex-wrap gap-3">{topicList.map((topic) => <Link key={topic} className="rounded-full bg-slate-100 px-5 py-3 font-bold text-slate-600 transition hover:bg-secondary hover:text-white" to={`/topics/${toSlug(topic)}`}>{topic}</Link>)}</div></section>
        <section id="regional" className="grid gap-6 lg:grid-cols-3">{['Jakarta & Policy', 'Java Economic Corridor', 'Eastern Indonesia'].map((region, index) => <article key={region} className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow"><span className="text-xs font-bold uppercase tracking-widest text-secondary">Regional Desk</span><h2 className="font-display mt-3 text-3xl font-bold text-primary">{region}</h2><p className="mt-3 leading-7 text-slate-600">Coverage stream for local governance, public services, business, culture, and community issues.</p><Link className="mt-5 inline-flex font-bold text-secondary" to="/regional">View regional updates {index + 1}</Link></article>)}</section>
      </main>
      <MinimalFooter />
    </>
  );
}
