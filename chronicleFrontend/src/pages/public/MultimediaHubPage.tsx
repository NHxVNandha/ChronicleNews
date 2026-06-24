import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function MultimediaHubPage() {
  const items = [
    ['Video Reports', 'play_circle', 'Visual explainers, interviews, and documentary-style short reports.', '/video'],
    ['Podcast & Audio', 'podcasts', 'Editorial briefings and newsroom conversations for mobile readers.', '/podcast'],
  ];

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        <section className="mb-10 rounded-2xl bg-primary p-8 text-white editorial-shadow md:p-12"><p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">Multimedia</p><h1 className="font-display max-w-4xl text-5xl font-bold md:text-6xl">Video and audio journalism grouped into one destination.</h1></section>
        <div className="grid gap-8 lg:grid-cols-2">{items.map(([title, icon, description, to]) => <Link key={title} to={to} className="group rounded-2xl border border-slate-200 bg-white p-8 soft-shadow transition hover:-translate-y-1 hover:shadow-xl"><span className="mb-6 grid h-16 w-16 place-items-center rounded-xl bg-blue-50 text-secondary"><Icon name={icon} className="text-4xl" /></span><h2 className="font-display text-4xl font-bold text-primary group-hover:text-secondary">{title}</h2><p className="mt-4 text-lg leading-8 text-slate-600">{description}</p></Link>)}</div>
      </main>
      <MinimalFooter />
    </>
  );
}
