import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AiEditorialAssistant } from '../../components/AiEditorialAssistant';
import { ArticlePreviewPanel } from '../../components/ArticlePreviewPanel';
import { PublishConfirmModal } from '../../components/PublishConfirmModal';
import { Field, Icon } from '../../components/ui';
import { articles } from '../../data';
import { AdminLayout } from '../../layouts/AdminLayout';

export function AdminEditor() {
  const { slug } = useParams();
  const editingArticle = articles.find((article) => article.slug === slug);
  const isEditing = Boolean(editingArticle);

  const [title, setTitle] = useState(editingArticle?.title ?? '');
  const [summary, setSummary] = useState(editingArticle?.summary ?? '');
  const [image, setImage] = useState(editingArticle?.image ?? '');
  const [category, setCategory] = useState(editingArticle?.category ?? 'Technology');
  const [showPreview, setShowPreview] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const previewArticle = {
    title: title || 'Untitled Article',
    summary: summary || 'No summary provided.',
    image: image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85',
    category,
    author: editingArticle?.author ?? 'Staff Reporter',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: editingArticle?.readTime ?? '5 min read',
  };

  return (
    <AdminLayout title={isEditing ? 'Edit Article' : 'Create Article'}>
      {showPreview && <ArticlePreviewPanel article={previewArticle} onClose={() => setShowPreview(false)} />}
      {showPublish && (
        <PublishConfirmModal
          title={previewArticle.title}
          onPublish={() => { setShowPublish(false); setStatusMessage('Article published successfully!'); setTimeout(() => setStatusMessage(''), 3000); }}
          onSchedule={(date) => { setShowPublish(false); setStatusMessage(`Scheduled for ${new Date(date).toLocaleString()}`); setTimeout(() => setStatusMessage(''), 3000); }}
          onClose={() => setShowPublish(false)}
        />
      )}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-xl bg-white p-6 soft-shadow lg:p-12">
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
          <div className="min-h-[360px] py-8 text-lg leading-8 text-slate-400" contentEditable suppressContentEditableWarning>
            {isEditing ? 'Continue editing this story draft or published article...' : 'Start writing your story here...'}
          </div>
        </section>
        <aside className="space-y-6 rounded-xl bg-white p-6 soft-shadow">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-bold uppercase tracking-wider !text-white" type="button" onClick={() => setShowPublish(true)}><Icon name="publish" /> Publish Now</button>
          {statusMessage && <div className="rounded-lg bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-700">{statusMessage}</div>}
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-lg bg-slate-100 py-3 font-bold text-primary hover:bg-slate-200" type="button">Draft</button>
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
              <option>Technology</option>
              <option>Education</option>
              <option>Health</option>
              <option>Sports</option>
              <option>Politics & Policy</option>
              <option>Economy</option>
              <option>Media</option>
            </select>
          </label>
          <div className="rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Status</p>
            <p className="mt-2 font-bold text-primary">{editingArticle?.status ?? 'Draft'} · Last edited {editingArticle?.updatedAt ?? '2m ago'}</p>
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
