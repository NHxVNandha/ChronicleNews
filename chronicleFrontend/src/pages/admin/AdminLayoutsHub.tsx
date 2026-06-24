import { useEffect, useState } from 'react';
import { NewsLayoutRenderer } from '../../components/layout-builder/NewsLayoutRenderer';
import { SkeletonBlock, SkeletonLine } from '../../components/Skeleton';
import { Icon } from '../../components/ui';
import { articles, categories } from '../../data';
import {
  createLayoutSection,
  defaultLayoutTemplate,
  layoutComponents,
  type LayoutCategory,
  type LayoutComponent,
  type LayoutStatus,
  type NewsLayoutSection,
  type NewsLayoutTemplate,
} from '../../data/layouts';
import { AdminLayout } from '../../layouts/AdminLayout';

const statuses: LayoutStatus[] = ['All', 'Published', 'Draft', 'Scheduled', 'Needs Review', 'Archived'];
const categoryOptions: LayoutCategory[] = ['All', ...Array.from(new Set([...categories.map((category) => category.name), ...articles.map((article) => article.category)]))] as LayoutCategory[];

function updateSection(template: NewsLayoutTemplate, sectionId: string, updater: (section: NewsLayoutSection) => NewsLayoutSection) {
  return { ...template, sections: template.sections.map((section) => section.id === sectionId ? updater(section) : section) };
}

export function AdminLayoutsHub() {
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<NewsLayoutTemplate>(defaultLayoutTemplate);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);
  const [selectedSectionId, setSelectedSectionId] = useState(defaultLayoutTemplate.sections[0]?.id ?? '');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'md' | 'desktop'>('desktop');

  const selectedSection = template.sections.find((section) => section.id === selectedSectionId) ?? template.sections[0];

  function patchSelected(updater: (section: NewsLayoutSection) => NewsLayoutSection) {
    if (!selectedSection) return;
    setTemplate((current) => updateSection(current, selectedSection.id, updater));
  }

  function addSection(component: LayoutComponent = 'grid') {
    const section = createLayoutSection(component);
    setTemplate((current) => ({ ...current, sections: [...current.sections, section] }));
    setSelectedSectionId(section.id);
  }

  function duplicateSection(sectionId: string) {
    const section = template.sections.find((item) => item.id === sectionId);
    if (!section) return;
    const copy = { ...section, id: `${section.id}-copy-${Date.now()}`, title: `${section.title} Copy` };
    setTemplate((current) => ({ ...current, sections: [...current.sections, copy] }));
    setSelectedSectionId(copy.id);
  }

  function deleteSection(sectionId: string) {
    setTemplate((current) => {
      const sections = current.sections.filter((section) => section.id !== sectionId);
      setSelectedSectionId(sections[0]?.id ?? '');
      return { ...current, sections };
    });
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    setTemplate((current) => {
      const index = current.sections.findIndex((section) => section.id === sectionId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.sections.length) return current;
      const sections = [...current.sections];
      [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
      return { ...current, sections };
    });
  }

  return (
    <AdminLayout title="Layouts">
      {loading ? (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <SkeletonLine width="320px" />
              <SkeletonLine width="420px" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-12 w-28" />
              <SkeletonBlock className="h-12 w-40" />
            </div>
          </div>
          <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-6">
              <SkeletonBlock className="h-[460px]" />
              <SkeletonBlock className="h-[120px]" />
            </div>
            <div className="space-y-6">
              <SkeletonBlock className="h-[400px]" />
            </div>
          </div>
          <SkeletonBlock className="h-[500px]" />
        </div>
      ) : (
      <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-primary">News Layout Builder</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Create reusable news layout templates. Sections are filled automatically from article rules instead of manual article picking.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-bold text-primary" type="button" onClick={() => setTemplate((current) => ({ ...current, status: 'Draft' }))}>Save Draft</button>
          <button className="rounded-lg bg-primary px-5 py-3 font-bold !text-white" type="button" onClick={() => setTemplate((current) => ({ ...current, status: 'Published' }))}>Publish Template</button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white"><Icon name="view_quilt" /></span>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-primary">Template Editor</h2>
            <p className="text-sm text-slate-500">{template.name} · {template.sections.length} sections</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${template.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{template.status}</span>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow">
            <div className="mb-4 flex items-center justify-between">
              <div><h3 className="text-xl font-bold text-primary">Sections</h3><p className="text-sm text-slate-500">{template.sections.length} modules · 10 component variations</p></div>
            </div>
            <div className="space-y-2">
              {template.sections.map((section, index) => (
                <button key={section.id} className={`w-full rounded-lg border px-4 py-3 text-left transition ${selectedSection?.id === section.id ? 'border-primary bg-primary !text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-secondary hover:bg-blue-50'}`} type="button" onClick={() => setSelectedSectionId(section.id)}>
                  <span className="block text-xs font-bold uppercase tracking-widest opacity-70">{index + 1}. {section.component}</span>
                  <span className="font-bold">{section.title}</span>
                </button>
              ))}
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white px-3 py-3 font-bold text-primary transition hover:border-secondary hover:bg-blue-50" type="button" onClick={() => addSection('grid')}><Icon name="add" /> Add Section</button>
          </section>

          {selectedSection && <section className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow"><h3 className="mb-4 text-xl font-bold text-primary">Section Actions</h3><div className="grid grid-cols-2 gap-2"><button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-primary" type="button" onClick={() => moveSection(selectedSection.id, -1)}>Move Up</button><button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-primary" type="button" onClick={() => moveSection(selectedSection.id, 1)}>Move Down</button><button className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-secondary" type="button" onClick={() => duplicateSection(selectedSection.id)}>Duplicate</button><button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" type="button" onClick={() => deleteSection(selectedSection.id)}>Delete</button></div></section>}
        </aside>

        <aside className="space-y-6">
          {selectedSection ? (
            <section className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow">
              <h3 className="font-display mb-4 text-2xl font-bold text-primary">Settings</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block"><span className="mb-1 block text-sm font-bold text-slate-600">Section Title</span><input className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" value={selectedSection.title} onChange={(event) => patchSelected((section) => ({ ...section, title: event.target.value }))} /></label>
                <label className="block"><span className="mb-1 block text-sm font-bold text-slate-600">Component</span><select className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" value={selectedSection.component} onChange={(event) => patchSelected((section) => ({ ...section, component: event.target.value as LayoutComponent }))}>{layoutComponents.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                <label className="block"><span className="mb-1 block text-sm font-bold text-slate-600">Category Source</span><select className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" value={selectedSection.dataSource.category} onChange={(event) => patchSelected((section) => ({ ...section, dataSource: { ...section.dataSource, category: event.target.value as LayoutCategory } }))}>{categoryOptions.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label className="block"><span className="mb-1 block text-sm font-bold text-slate-600">Status Source</span><select className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" value={selectedSection.dataSource.status} onChange={(event) => patchSelected((section) => ({ ...section, dataSource: { ...section.dataSource, status: event.target.value as LayoutStatus } }))}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                <label className="block"><span className="mb-1 block text-sm font-bold text-slate-600">Sort</span><select className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" value={selectedSection.dataSource.sortBy} onChange={(event) => patchSelected((section) => ({ ...section, dataSource: { ...section.dataSource, sortBy: event.target.value as 'latest' | 'popular' } }))}><option value="latest">Latest</option><option value="popular">Popular</option></select></label>
                <label className="block"><span className="mb-1 block text-sm font-bold text-slate-600">Limit</span><input className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" min={1} max={8} type="number" value={selectedSection.dataSource.limit} onChange={(event) => patchSelected((section) => ({ ...section, dataSource: { ...section.dataSource, limit: Number(event.target.value) || 1 } }))} /></label>
                <button className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 text-left font-bold text-primary lg:col-span-2" type="button" onClick={() => patchSelected((section) => ({ ...section, dataSource: { ...section.dataSource, featuredOnly: !section.dataSource.featuredOnly } }))}><span>Featured only</span><span className={`h-6 w-11 rounded-full p-1 ${selectedSection.dataSource.featuredOnly ? 'bg-secondary' : 'bg-slate-300'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${selectedSection.dataSource.featuredOnly ? 'translate-x-5' : ''}`} /></span></button>
              </div>
            </section>
          ) : <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"><Icon name="view_quilt" className="text-4xl text-slate-300" /><p className="mt-3 font-bold text-primary">Add a section to begin.</p></section>}
        </aside>
      </div>

      <div className="mt-8 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-white"><Icon name="visibility" /></span>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-primary">Live Preview</h2>
            <p className="text-sm text-slate-500">{template.name} · Target: homepage · Updates instantly</p>
          </div>
          <div className="flex gap-2">{(['mobile', 'md', 'desktop'] as const).map((mode) => <button key={mode} className={`rounded-lg px-3 py-2 text-sm font-bold ${previewMode === mode ? 'bg-primary !text-white' : 'bg-slate-100 text-slate-600'}`} type="button" onClick={() => setPreviewMode(mode)}>{mode === 'md' ? 'Tablet' : mode === 'mobile' ? 'Mobile' : 'Desktop'}</button>)}</div>
        </div>
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 soft-shadow">
        <div className={`mx-auto transition-all ${previewMode === 'mobile' ? 'max-w-sm' : previewMode === 'md' ? 'max-w-3xl' : 'max-w-none'}`}>
          <NewsLayoutRenderer template={template} articles={articles} previewMode={previewMode} />
        </div>
      </section>
      </div>
      </>
      )}
    </AdminLayout>
  );
}
