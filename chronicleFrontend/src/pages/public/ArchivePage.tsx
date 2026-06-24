import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { toSlug } from '../../config/navigation';
import { articles, categories } from '../../data';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function ArchivePage() {
  const years = ['2024', '2023', '2022', '2021'];

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        <section className="mb-10 rounded-2xl bg-primary p-8 text-white editorial-shadow md:p-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">Chronicle Archive</p>
          <h1 className="font-display max-w-4xl text-5xl font-bold leading-tight md:text-6xl">A living record of the stories that shaped the public conversation.</h1>
          <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px_180px]">
            <input className="rounded-xl border border-white/15 bg-white/10 px-5 py-4 outline-none placeholder:text-white/40 focus:border-secondary" placeholder="Search the archive..." />
            <select className="rounded-xl border border-white/15 bg-white/10 px-5 py-4 outline-none"><option>All Sections</option><option>Technology</option><option>Policy</option><option>Health</option></select>
            <button className="rounded-xl bg-secondary px-6 py-4 font-bold uppercase tracking-wider text-white">Search</button>
          </div>
        </section>
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow"><h2 className="mb-4 font-bold text-primary">Browse By Year</h2><div className="space-y-2">{years.map((year, index) => <button key={year} className={`w-full rounded-lg px-4 py-3 text-left font-bold ${index === 0 ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}>{year}</button>)}</div></section>
            <section className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow"><h2 className="mb-4 font-bold text-primary">Sections</h2><div className="space-y-2">{categories.map((category) => <Link key={category.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 font-bold text-slate-600 transition hover:bg-blue-50 hover:text-secondary" to={`/topics/${toSlug(category.name)}`}>{category.name}<Icon name="arrow_forward" className="text-base" /></Link>)}</div></section>
          </aside>
          <section className="space-y-5">{articles.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="group grid gap-5 rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl md:grid-cols-[180px_minmax(0,1fr)]"><img className="aspect-video h-full w-full rounded-lg object-cover" src={article.image} alt="" /><div><div className="mb-2 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-widest"><span className="text-secondary">{article.category}</span><span className="text-slate-400">{article.date}</span></div><h2 className="font-display text-3xl font-semibold text-primary transition group-hover:text-secondary">{article.title}</h2><p className="mt-2 line-clamp-2 leading-7 text-slate-600">{article.summary}</p><p className="mt-4 text-sm font-bold text-slate-500">By {article.author} · {article.readTime}</p></div></Link>)}</section>
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
