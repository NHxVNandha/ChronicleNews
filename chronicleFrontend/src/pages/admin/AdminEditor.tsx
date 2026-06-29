import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AiEditorialAssistant } from '../../components/AiEditorialAssistant';
import { ArticlePreviewPanel } from '../../components/ArticlePreviewPanel';
import { PublishConfirmModal } from '../../components/PublishConfirmModal';
import { Field, Icon } from '../../components/ui';
import { AdminLayout } from '../../layouts/AdminLayout';
import { createArticle, getArticleEditorBySlug, getCategories, publishArticle, saveArticle, type ArticleEditorRecord, type Category } from '../../services';

export function AdminEditor() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [editingArticle, setEditingArticle] = useState<ArticleEditorRecord | undefined>();
  const isEditing = Boolean(editingArticle);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

  const [title, setTitle] = useState(editingArticle?.title ?? '');
  const [summary, setSummary] = useState(editingArticle?.summary ?? '');
  const [image, setImage] = useState(editingArticle?.featuredImageUrl ?? '');
  const [category, setCategory] = useState(editingArticle?.categoryName ?? 'Technology');
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [categories, article] = await Promise.all([
          getCategories(),
          slug ? getArticleEditorBySlug(slug) : Promise.resolve(undefined),
        ]);

        if (!isMounted) return;

        setCategoryOptions(categories);
        setEditingArticle(article);
        setTitle(article?.title ?? '');
        setSummary(article?.summary ?? '');
        setImage(article?.featuredImageUrl ?? '');
        setCategory(article?.categoryName ?? categories[0]?.name ?? 'Technology');
        setBody(article?.body ?? '');
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load editor data.');
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const previewArticle = {
    title: title || 'Untitled Article',
    summary: summary || 'No summary provided.',
    image: image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85',
    category,
    author: editingArticle?.authorName ?? 'Staff Reporter',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: '5 min read',
  };

  async function handleSaveDraft() {
    try {
      setSaving(true);
      setError('');
      if (slug && isEditing) {
        const saved = await saveArticle(slug, { title, summary, body, category, featuredImageUrl: image, featured: editingArticle?.featured ?? false });
        setEditingArticle(saved);
      } else {
        const created = await createArticle({ title, summary, body, category, featuredImageUrl: image, featured: false });
        setEditingArticle(created);
        navigate(`/admin/articles/${created.slug}/edit`, { replace: true });
      }
      setStatusMessage('Draft saved successfully.');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublishNow() {
    try {
      setSaving(true);
      setError('');

      let currentSlug = slug;
      if (!currentSlug) {
        const created = await createArticle({ title, summary, body, category, featuredImageUrl: image, featured: false });
        setEditingArticle(created);
        currentSlug = created.slug;
        navigate(`/admin/articles/${created.slug}/edit`, { replace: true });
      } else {
        const saved = await saveArticle(currentSlug, { title, summary, body, category, featuredImageUrl: image, featured: editingArticle?.featured ?? false });
        setEditingArticle(saved);
      }

      const published = await publishArticle(currentSlug);
      if (published) {
        setEditingArticle(published);
      }

      setShowPublish(false);
      setStatusMessage('Article published successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Failed to publish article.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title={isEditing ? 'Edit Article' : 'Create Article'}>
      {showPreview && <ArticlePreviewPanel article={previewArticle} onClose={() => setShowPreview(false)} />}
      {showPublish && (
        <PublishConfirmModal
          title={previewArticle.title}
          onPublish={() => { void handlePublishNow(); }}
          onSchedule={(date) => { setShowPublish(false); setStatusMessage(`Scheduled for ${new Date(date).toLocaleString()}`); setTimeout(() => setStatusMessage(''), 3000); }}
          onClose={() => setShowPublish(false)}
        />
      )}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-xl bg-white p-6 soft-shadow lg:p-12">
          {error && <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
          <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Article Title</label>
          <textarea className="mt-2 w-full resize-none border-0 bg-transparent font-display text-4xl font-bold leading-tight text-primary outline-none" value={title} onChange={(e) => setTitle(e.target.value)} rows={2} placeholder="Enter a compelling headline..." />
          <label className="mt-8 block text-sm font-bold uppercase tracking-widest text-slate-400">Deck / Summary</label>
          <textarea className="mt-2 w-full resize-none border-b border-slate-200 bg-transparent pb-5 text-lg outline-none" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="Write a brief, punchy summary to appear in previews..." />
          <div className="mt-8 grid aspect-video place-items-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-secondary">
            {image ? <img className="h-full w-full object-cover" src={image} alt="" /> : (
              <div>
                <Icon name="add_photo_alternate" className="text-5xl text-slate-400" />
                <p className="font-bold text-slate-500">Click to upload featured image</p>
                <p className="text-sm text-slate-400">Recommended: 16:9, min 1920x1080px</p>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85'].map((url) => (
              <button key={url} className={`aspect-video overflow-hidden rounded-lg border-2 transition ${image === url ? 'border-secondary ring-2 ring-secondary' : 'border-transparent hover:border-slate-300'}`} type="button" onClick={() => setImage(url)}>
                <img className="h-full w-full object-cover" src={url} alt="" />
              </button>
            ))}
          </div>
          <div className="mt-8 border-b border-slate-200 pb-2">
            <div className="flex gap-2 overflow-x-auto">
              {['format_bold', 'format_italic', 'format_list_bulleted', 'format_quote', 'link', 'image', 'code'].map((icon) => (
                <button key={icon} className="rounded p-2 text-slate-600 hover:bg-slate-100 hover:text-primary" type="button"><Icon name={icon} /></button>
              ))}
            </div>
          </div>
          <textarea className="min-h-[360px] w-full py-8 text-lg leading-8 text-slate-700 outline-none" value={body} onChange={(e) => setBody(e.target.value)} placeholder={isEditing ? 'Continue editing this story draft or published article...' : 'Start writing your story here...'} />
        </section>
        <aside className="space-y-6 rounded-xl bg-white p-6 soft-shadow">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-bold uppercase tracking-wider !text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={saving} type="button" onClick={() => setShowPublish(true)}><Icon name="publish" /> {saving ? 'Working...' : 'Publish Now'}</button>
          {statusMessage && <div className="rounded-lg bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-700">{statusMessage}</div>}
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-lg bg-slate-100 py-3 font-bold text-primary hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60" disabled={saving} type="button" onClick={() => void handleSaveDraft()}>{saving ? 'Saving...' : 'Draft'}</button>
            <button className="rounded-lg bg-slate-100 py-3 font-bold text-primary hover:bg-slate-200" type="button">Schedule</button>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <h3 className="mb-2 font-bold text-primary">Preview & Publish</h3>
            <p className="mb-4 text-sm leading-6 text-slate-600">Review the public article layout before sending it to the homepage or scheduled queue.</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-primary hover:bg-slate-50" type="button" onClick={() => setShowPreview(true)}>Preview</button>
              <button className="rounded-lg bg-secondary px-3 py-2 text-sm font-bold !text-white" type="button">Confirm</button>
            </div>
          </div>
          <Field label="Tags" placeholder="Add tags..." icon="tag" />
          <label className="block">
            <span className="mb-2 block font-bold">Category</span>
            <select className="w-full rounded-lg border border-slate-200 p-3 outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categoryOptions.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </select>
          </label>
          <div className="rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Status</p>
            <p className="mt-2 font-bold text-primary">{editingArticle?.status ?? 'Draft'}{editingArticle ? ` · ${editingArticle.slug}` : ''}</p>
            <p className="text-sm text-slate-500">Visibility: Public</p>
          </div>
          <AiEditorialAssistant />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Publishing Rules</p>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-3 text-sm text-slate-600"><input className="h-4 w-4 accent-secondary" type="checkbox" defaultChecked /> Auto-publish to homepage</label>
              <label className="flex items-center gap-3 text-sm text-slate-600"><input className="h-4 w-4 accent-secondary" type="checkbox" defaultChecked /> Send push notification</label>
              <label className="flex items-center gap-3 text-sm text-slate-600"><input className="h-4 w-4 accent-secondary" type="checkbox" /> Syndicate to partners</label>
            </div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Quick Actions</p>
            <div className="mt-3 space-y-2">
              <button className="flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100" type="button"><Icon name="content_copy" /> Duplicate Article</button>
              <button className="flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50" type="button"><Icon name="delete" /> Move to Trash</button>
            </div>
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}
