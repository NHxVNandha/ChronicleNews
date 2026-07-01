import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { AiEditorialAssistant } from '../../components/AiEditorialAssistant';
import { AdminPageHeader, AdminPanel, AdminStatusBadge } from '../../components/admin';
import { ArticlePreviewPanel } from '../../components/ArticlePreviewPanel';
import { PublishConfirmModal } from '../../components/PublishConfirmModal';
import { Field, Icon } from '../../components/ui';
import { AdminLayout } from '../../layouts/AdminLayout';
import { createArticle, getArticleEditorBySlug, getCategories, publishArticle, saveArticle, type ArticleEditorRecord, type Category } from '../../services';

const editorSchema = z.object({
  title: z.string().trim().min(8, 'Headline must be at least 8 characters.'),
  summary: z.string().trim().min(20, 'Summary must be at least 20 characters.').max(240, 'Summary should stay under 240 characters.'),
  featuredImageUrl: z.string(),
  category: z.string().trim().min(1, 'Select a category.'),
  body: z.string().trim().min(80, 'Article body must be at least 80 characters.'),
});

type EditorFormValues = z.infer<typeof editorSchema>;

const defaultEditorValues: EditorFormValues = {
  title: '',
  summary: '',
  featuredImageUrl: '',
  category: 'Technology',
  body: '',
};

export function AdminEditor() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [editingArticle, setEditingArticle] = useState<ArticleEditorRecord | undefined>();
  const isEditing = Boolean(editingArticle);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { register, reset, watch, handleSubmit, setValue, trigger, formState: { errors } } = useForm<EditorFormValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: defaultEditorValues,
    mode: 'onBlur',
  });

  const formValues = watch();

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
        reset({
          title: article?.title ?? '',
          summary: article?.summary ?? '',
          featuredImageUrl: article?.featuredImageUrl ?? '',
          category: article?.categoryName ?? categories[0]?.name ?? 'Technology',
          body: article?.body ?? '',
        });
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load editor data.');
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [reset, slug]);

  const previewArticle = {
    title: formValues.title || 'Untitled Article',
    summary: formValues.summary || 'No summary provided.',
    image: formValues.featuredImageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85',
    category: formValues.category,
    author: editingArticle?.authorName ?? 'Staff Reporter',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: '5 min read',
  };

  function syncEditorForm(article: ArticleEditorRecord) {
    setEditingArticle(article);
    reset({
      title: article.title,
      summary: article.summary,
      featuredImageUrl: article.featuredImageUrl ?? '',
      category: article.categoryName,
      body: article.body,
    });
  }

  const saveDraftMutation = useMutation({
    mutationFn: async (values: EditorFormValues) => {
      if (slug && isEditing) {
        return saveArticle(slug, { ...values, featured: editingArticle?.featured ?? false });
      }

      return createArticle({ ...values, featured: false });
    },
    onSuccess: (article) => {
      syncEditorForm(article);
      if (!slug || !isEditing) {
        navigate(`/admin/articles/${article.slug}/edit`, { replace: true });
      }
      void queryClient.invalidateQueries({ queryKey: ['articles'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
      setStatusMessage('Draft saved successfully.');
      toast.success('Draft saved.');
      setTimeout(() => setStatusMessage(''), 3000);
    },
    onError: (saveError) => {
      const message = saveError instanceof Error ? saveError.message : 'Failed to save article.';
      setError(message);
      toast.error(message);
    },
  });

  const publishArticleMutation = useMutation({
    mutationFn: async (values: EditorFormValues) => {
      let currentArticle: ArticleEditorRecord;

      if (!slug) {
        currentArticle = await createArticle({ ...values, featured: false });
      } else {
        currentArticle = await saveArticle(slug, { ...values, featured: editingArticle?.featured ?? false });
      }

      const published = await publishArticle(currentArticle.slug);
      return published ?? currentArticle;
    },
    onSuccess: (article) => {
      syncEditorForm(article);
      if (!slug) {
        navigate(`/admin/articles/${article.slug}/edit`, { replace: true });
      }
      void queryClient.invalidateQueries({ queryKey: ['articles'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
      setShowPublish(false);
      setStatusMessage('Article published successfully!');
      toast.success('Article published successfully.');
      setTimeout(() => setStatusMessage(''), 3000);
    },
    onError: (publishError) => {
      const message = publishError instanceof Error ? publishError.message : 'Failed to publish article.';
      setError(message);
      toast.error(message);
    },
  });

  async function persistDraft(values: EditorFormValues) {
    try {
      setSaving(true);
      setError('');
      await saveDraftMutation.mutateAsync(values);
    } finally {
      setSaving(false);
    }
  }

  const handleSaveDraft = handleSubmit(async (values) => {
    await persistDraft(values);
  });

  async function handlePublishNow(values: EditorFormValues) {
    try {
      setSaving(true);
      setError('');
      await publishArticleMutation.mutateAsync(values);
    } finally {
      setSaving(false);
    }
  }

  const submitPublishNow = handleSubmit(async (values) => {
    await handlePublishNow(values);
  });

  async function openPublishModal() {
    const isValid = await trigger(['title', 'summary', 'category', 'body']);
    if (!isValid) {
      toast.error('Complete the required article fields before publishing.');
      return;
    }

    setShowPublish(true);
  }

  return (
    <AdminLayout title={isEditing ? 'Edit Article' : 'Create Article'}>
      {showPreview && <ArticlePreviewPanel article={previewArticle} onClose={() => setShowPreview(false)} />}
      {showPublish && (
        <PublishConfirmModal
          title={previewArticle.title}
          onPublish={() => { void submitPublishNow(); }}
          onSchedule={(date) => { setShowPublish(false); setStatusMessage(`Scheduled for ${new Date(date).toLocaleString()}`); setTimeout(() => setStatusMessage(''), 3000); }}
          onClose={() => setShowPublish(false)}
        />
      )}
      <div className="space-y-8 lg:space-y-10">
        <AdminPageHeader
          eyebrow="Editorial Canvas"
          title={isEditing ? 'Edit Article' : 'Create Article'}
          description="Shape the headline, summary, imagery, and publishing controls in one focused editorial workspace."
          compact
          actions={
            <div className="flex flex-wrap items-center gap-3">
              {editingArticle && <AdminStatusBadge status={editingArticle.status === 'Published' ? 'published' : editingArticle.status === 'Scheduled' ? 'scheduled' : editingArticle.status === 'Needs Review' ? 'needs-review' : editingArticle.status === 'Archived' ? 'archived' : 'draft'}>{editingArticle.status}</AdminStatusBadge>}
              <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold !text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={saving} type="button" onClick={() => void openPublishModal()}>
                <Icon name="publish" className="mr-2 inline text-[18px]" />{saving ? 'Working...' : 'Publish Now'}
              </button>
            </div>
          }
        />

        {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <AdminPanel className="overflow-hidden">
            <div className="space-y-8 lg:space-y-10">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Article Title</label>
                <textarea className={`mt-3 w-full resize-none border-0 bg-transparent font-display text-4xl font-bold leading-tight tracking-tight outline-none lg:text-5xl ${errors.title ? 'text-red-700 placeholder:text-red-300' : 'text-slate-950'}`} rows={2} placeholder="Enter a compelling headline..." {...register('title')} />
                {errors.title && <p className="mt-2 text-sm font-semibold text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Deck / Summary</label>
                <textarea className={`mt-3 w-full resize-none rounded-2xl border p-5 text-lg leading-8 outline-none transition focus:bg-white ${errors.summary ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-300' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-slate-300'}`} rows={3} placeholder="Write a brief, punchy summary to appear in previews..." {...register('summary')} />
                <div className="mt-2 flex items-center justify-between gap-3">
                  {errors.summary ? <p className="text-sm font-semibold text-red-600">{errors.summary.message}</p> : <span className="text-sm text-slate-400">Used in previews and cards.</span>}
                  <span className={`text-xs font-semibold ${formValues.summary.length > 240 ? 'text-red-500' : 'text-slate-400'}`}>{formValues.summary.length}/240</span>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Featured Image</label>
                  <span className="text-xs font-semibold text-slate-500">16:9 recommended</span>
                </div>
                <div className="grid aspect-video place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-secondary">
                  {formValues.featuredImageUrl ? <img className="h-full w-full object-cover" src={formValues.featuredImageUrl} alt="" /> : (
                    <div>
                      <Icon name="add_photo_alternate" className="text-5xl text-slate-400" />
                      <p className="mt-3 font-bold text-slate-600">Select a featured image</p>
                      <p className="text-sm text-slate-400">Premium cover treatment for article previews.</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85'].map((url) => (
                    <button key={url} className={`aspect-video overflow-hidden rounded-xl border-2 transition ${formValues.featuredImageUrl === url ? 'border-secondary ring-2 ring-secondary/30' : 'border-transparent hover:border-slate-300'}`} type="button" onClick={() => setValue('featuredImageUrl', url, { shouldDirty: true })}>
                      <img className="h-full w-full object-cover" src={url} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-wrap gap-2 overflow-x-auto">
                  {['format_bold', 'format_italic', 'format_list_bulleted', 'format_quote', 'link', 'image', 'code'].map((icon) => (
                    <button key={icon} className="rounded-xl bg-white p-2.5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950" type="button"><Icon name={icon} className="text-[18px]" /></button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Article Body</label>
                <textarea className={`mt-3 min-h-[420px] w-full rounded-2xl border p-6 text-lg leading-8 outline-none transition ${errors.body ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-300' : 'border-slate-200 bg-white text-slate-700 focus:border-slate-300'}`} placeholder={isEditing ? 'Continue editing this story draft or published article...' : 'Start writing your story here...'} {...register('body')} />
                <div className="mt-2 flex items-center justify-between gap-3">
                  {errors.body ? <p className="text-sm font-semibold text-red-600">{errors.body.message}</p> : <span className="text-sm text-slate-400">Aim for enough context before sending to review.</span>}
                  <span className={`text-xs font-semibold ${formValues.body.trim().length < 80 ? 'text-amber-600' : 'text-slate-400'}`}>{formValues.body.trim().length} chars</span>
                </div>
              </div>
            </div>
          </AdminPanel>

          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            {statusMessage && <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700 shadow-sm">{statusMessage}</div>}

            <AdminPanel tone="dark" title="Publish & Workflow" description="Finalize editorial actions from one control rail.">
              <div className="space-y-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60" disabled={saving} type="button" onClick={() => void openPublishModal()}>
                  <Icon name="publish" className="text-[18px]" /> {saving ? 'Working...' : 'Publish Now'}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-xl bg-white/10 py-3 text-sm font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60" disabled={saving} type="button" onClick={() => void handleSaveDraft()}>{saving ? 'Saving...' : 'Save Draft'}</button>
                  <button className="rounded-xl bg-white/10 py-3 text-sm font-bold text-white transition hover:bg-white/15" type="button">Schedule</button>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Status</p>
                  <p className="mt-2 font-semibold text-white">{editingArticle?.status ?? 'Draft'}{editingArticle ? ` · ${editingArticle.slug}` : ''}</p>
                  <p className="mt-1 text-slate-400">Visibility: Public</p>
                </div>
              </div>
            </AdminPanel>

            <AdminPanel title="Preview & Publish" description="Review the public layout before sending it live." tone="accent">
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-primary shadow-sm transition hover:bg-slate-50" type="button" onClick={() => setShowPreview(true)}>Preview</button>
                <button className="rounded-xl bg-secondary px-3 py-2 text-sm font-bold !text-white shadow-sm transition hover:bg-blue-600" type="button" onClick={() => setShowPublish(true)}>Confirm</button>
              </div>
            </AdminPanel>

            <AdminPanel title="Metadata" description="Editorial settings for classification and discovery.">
              <div className="space-y-4">
                <Field label="Tags" placeholder="Add tags..." icon="tag" />
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Category</span>
                  <select className={`w-full rounded-xl border p-3 outline-none transition focus:bg-white ${errors.category ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-300' : 'border-slate-200 bg-slate-50 focus:border-slate-300'}`} {...register('category')}>
                    {categoryOptions.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                  </select>
                  {errors.category && <p className="mt-2 text-sm font-semibold text-red-600">{errors.category.message}</p>}
                </label>
              </div>
            </AdminPanel>

            <AdminPanel title="AI Assistant" description="Editorial help integrated into the publishing rail." tone="subtle">
              <AiEditorialAssistant />
            </AdminPanel>

            <AdminPanel title="Publishing Rules" description="Default behaviors for distribution and publishing." tone="subtle">
              <div className="space-y-3 text-sm text-slate-600">
                <label className="flex items-center gap-3"><input className="h-4 w-4 accent-secondary" type="checkbox" defaultChecked /> Auto-publish to homepage</label>
                <label className="flex items-center gap-3"><input className="h-4 w-4 accent-secondary" type="checkbox" defaultChecked /> Send push notification</label>
                <label className="flex items-center gap-3"><input className="h-4 w-4 accent-secondary" type="checkbox" /> Syndicate to partners</label>
              </div>
            </AdminPanel>

            <AdminPanel title="Quick Actions" description="Common editorial shortcuts for this story." tone="subtle">
              <div className="space-y-2">
                <button className="flex w-full items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100" type="button"><Icon name="content_copy" className="text-[18px]" /> Duplicate Article</button>
                <button className="flex w-full items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50" type="button"><Icon name="delete" className="text-[18px]" /> Move to Trash</button>
              </div>
            </AdminPanel>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}
