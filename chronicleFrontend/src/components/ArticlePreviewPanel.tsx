import { Icon } from './ui';

type PreviewArticle = {
  title: string;
  summary: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
};

export function ArticlePreviewPanel({
  article,
  onClose,
}: {
  article: PreviewArticle;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-12 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-2xl bg-white soft-shadow">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h3 className="font-display text-2xl font-bold text-primary">Article Preview</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Updates in real-time</span>
            <button
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary"
              type="button"
              onClick={onClose}
            >
              <Icon name="close" />
            </button>
          </div>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-2">
          <section>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
              Card Preview (list / category view)
            </h4>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="aspect-video overflow-hidden bg-slate-200">
                <img
                  className="h-full w-full object-cover"
                  src={article.image}
                  alt=""
                />
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest">
                  <span className="text-secondary">{article.category || 'Category'}</span>
                  <span className="text-slate-400">{article.date || 'Today'}</span>
                </div>
                <h3 className="font-display mb-3 text-2xl font-semibold leading-tight text-primary">
                  {article.title || 'Untitled Article'}
                </h3>
                <p className="line-clamp-2 text-slate-600">
                  {article.summary || 'No summary provided.'}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
              Hero Preview (article detail / featured)
            </h4>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-[2/1] overflow-hidden bg-slate-200">
                <img
                  className="h-full w-full object-cover"
                  src={article.image}
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="mb-2 inline-block rounded-full bg-secondary px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {article.category || 'Category'}
                  </span>
                  <h2 className="font-display text-3xl font-bold leading-tight text-white lg:text-4xl">
                    {article.title || 'Untitled Article'}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="font-bold text-secondary">
                    By {article.author || 'Author'}
                  </span>
                  <span>{article.date || 'Today'}</span>
                  <span>{article.readTime || '5 min read'}</span>
                </div>
                <p className="mt-4 leading-8 text-slate-600">
                  {article.summary || 'No summary provided.'}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end border-t border-slate-200 p-6">
          <button
            className="rounded-lg bg-primary px-6 py-3 font-bold text-white"
            type="button"
            onClick={onClose}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
