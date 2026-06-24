import { useMemo, useState } from 'react';
import { categories, mediaAssets } from '../../data';
import { Icon } from '../../components/ui';
import { AdminLayout } from '../../layouts/AdminLayout';

type AssetKind = 'All' | 'Image' | 'Video' | 'PDF';

const assetKinds: AssetKind[] = ['All', 'Image', 'Video', 'PDF'];

const assetDetails = mediaAssets.map((asset, index) => ({
  ...asset,
  usageCount: [12, 4, 2, 8, 0][index] ?? 0,
  altStatus: [true, false, true, true, false][index] ?? false,
  credit: ['Chronicle Visual Desk', 'Studio Portrait Unit', 'Field Reporter Pool', 'Design Systems', 'Editorial Floor'][index] ?? 'Chronicle Desk',
  license: ['Owned', 'Licensed', 'Owned', 'Owned', 'Pending'][index] ?? 'Owned',
  category: ['Front Page', 'Profiles', 'Environment', 'Technology', 'Newsroom'][index] ?? 'General',
}));

export function AdminAssetsHub() {
  const [activeKind, setActiveKind] = useState<AssetKind>('All');
  const [query, setQuery] = useState('');

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return assetDetails.filter((asset) => {
      const matchesKind = activeKind === 'All' || asset.type === activeKind;
      const matchesQuery =
        !normalizedQuery ||
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.category.toLowerCase().includes(normalizedQuery) ||
        asset.credit.toLowerCase().includes(normalizedQuery);

      return matchesKind && matchesQuery;
    });
  }, [activeKind, query]);

  const missingAlt = assetDetails.filter((asset) => !asset.altStatus).length;
  const unusedAssets = assetDetails.filter((asset) => asset.usageCount === 0).length;

  return (
    <AdminLayout title="Assets">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-primary">Assets Library</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Manage newsroom media, validate asset quality, and keep image, video, and file usage organized in one editorial media workspace.</p>
        </div>
        <button className="rounded-lg bg-primary px-5 py-3 font-bold text-white" type="button">Upload Media</button>
      </div>

      <section className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-10 text-center soft-shadow">
          <div>
            <Icon name="cloud_upload" className="text-5xl text-secondary" />
            <h2 className="font-display mt-3 text-3xl font-bold text-primary">Drop assets to upload</h2>
            <p className="mt-2 max-w-xl text-slate-600">Images, video, PDF, and editorial files for articles and multimedia packages.</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-primary">Asset Health</h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{missingAlt} need fixes</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"><span className="text-slate-600">Storage used</span><span className="font-bold text-primary">81.2 GB</span></div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"><span className="text-slate-600">Missing alt text</span><span className="font-bold text-amber-700">{missingAlt}</span></div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"><span className="text-slate-600">Unused files</span><span className="font-bold text-primary">{unusedAssets}</span></div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"><span className="text-slate-600">License pending</span><span className="font-bold text-red-700">1</span></div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white soft-shadow">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-primary">Media Library</h2>
                <p className="text-slate-600">Search, filter, and inspect visuals used across articles, packages, and newsroom publishing blocks.</p>
              </div>
              <label className="relative block min-w-0 lg:w-72">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 outline-none focus:border-secondary" placeholder="Search asset, desk, or credit..." value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {assetKinds.map((kind) => (
                <button key={kind} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${activeKind === kind ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-secondary'}`} type="button" onClick={() => setActiveKind(kind)}>
                  {kind}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAssets.map((asset) => (
              <article key={asset.name} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={asset.image} alt="" />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">{asset.type}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${asset.altStatus ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{asset.altStatus ? 'Alt Ready' : 'Needs Alt'}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-primary">{asset.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{asset.category} · {asset.credit}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${asset.license === 'Pending' ? 'bg-red-100 text-red-700' : asset.license === 'Licensed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{asset.license}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3 text-center text-xs">
                    <div><p className="font-bold text-primary">{asset.size}</p><p className="mt-1 text-slate-500">Size</p></div>
                    <div><p className="font-bold text-primary">{asset.usageCount}</p><p className="mt-1 text-slate-500">Uses</p></div>
                    <div><p className="font-bold text-primary">{asset.date}</p><p className="mt-1 text-slate-500">Added</p></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white" type="button">View Details</button>
                    <button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" type="button">Copy URL</button>
                    <button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" type="button">Attach</button>
                  </div>
                </div>
              </article>
            ))}
            {!filteredAssets.length && (
              <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                No assets match the current filter.
              </div>
            )}
          </div>
        </section>

        <aside>
          <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
            <h2 className="mb-4 font-bold text-primary">Taxonomy Health</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.name} className="rounded-lg bg-slate-50 p-3">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{category.name}</span>
                    <span className="font-bold text-slate-500">{category.count}</span>
                  </div>
                  <div className="overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-2.5 rounded-full ${category.tone}`} style={{ width: `${(category.count / Math.max(...categories.map((item) => item.count))) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AdminLayout>
  );
}
