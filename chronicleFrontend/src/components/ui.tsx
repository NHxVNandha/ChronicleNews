import { Link } from 'react-router-dom';
import type { Article } from '../data';

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export function Avatar({ src, alt, size = 'h-10 w-10' }: { src: string; alt: string; size?: string }) {
  return (
    <div className={`${size} overflow-hidden rounded-full border border-slate-200 bg-slate-100`}>
      <img className="h-full w-full object-cover" src={src} alt={alt} />
    </div>
  );
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <Link to={`/news/${article.slug}`} className="group block overflow-hidden rounded-xl border border-slate-200 bg-white soft-shadow transition hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-video overflow-hidden bg-slate-200">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={article.image} alt="" />
      </div>
      <div className={compact ? 'p-5' : 'p-6'}>
        <div className="mb-4 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest">
          <span className="text-secondary">{article.category}</span>
          <span className="text-slate-400">{article.date.split(',')[0]}</span>
        </div>
        <h3 className="font-display mb-3 text-2xl font-semibold leading-tight text-primary transition group-hover:text-secondary">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-slate-600">{article.summary}</p>
      </div>
    </Link>
  );
}

export function ImagePanel({ image, className = '' }: { image: string; className?: string }) {
  return <div className={`bg-cover bg-center ${className}`} style={{ backgroundImage: `url(${image})` }} />;
}

export function Field({ label, placeholder, icon, type = 'text' }: { label: string; placeholder: string; icon: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">{label}</span>
      <span className="relative block">
        <Icon name={icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="w-full rounded-lg border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 outline-none transition focus:border-secondary focus:ring-1 focus:ring-secondary" placeholder={placeholder} type={type} />
      </span>
    </label>
  );
}
