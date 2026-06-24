import type { Article } from '../data';

export type LayoutComponent = 'hero' | 'grid' | 'list' | 'table' | 'featureSplit' | 'carousel' | 'magazineCover' | 'sidebarFeatured' | 'quoteSpotlight' | 'multimediaStrip';
export type LayoutStatus = Article['status'] | 'All';
export type LayoutCategory = Article['category'] | 'All';

export type NewsLayoutSection = {
  id: string;
  title: string;
  component: LayoutComponent;
  responsive: {
    md: '1' | '2' | '3';
    desktop: '2' | '3' | '4' | 'feature';
  };
  dataSource: {
    category: LayoutCategory;
    status: LayoutStatus;
    featuredOnly: boolean;
    sortBy: 'latest' | 'popular';
    limit: number;
  };
};

export type NewsLayoutTemplate = {
  id: string;
  name: string;
  target: 'homepage';
  status: 'Draft' | 'Published';
  sections: NewsLayoutSection[];
};

export const layoutComponents: { value: LayoutComponent; label: string; description: string }[] = [
  { value: 'hero', label: 'Hero Feature', description: 'One dominant lead story with large image treatment.' },
  { value: 'grid', label: 'Article Grid', description: 'Responsive cards for multiple automatically selected stories.' },
  { value: 'list', label: 'List Stream', description: 'Compact vertical stream for latest or category feeds.' },
  { value: 'table', label: 'Data Table', description: 'Structured archive-style view with metadata columns.' },
  { value: 'featureSplit', label: 'Feature Split', description: 'Large lead story paired with a supporting stack.' },
  { value: 'carousel', label: 'Carousel', description: 'Horizontal slider treatment for rotating headlines.' },
  { value: 'magazineCover', label: 'Magazine Cover', description: 'Editorial cover style with typography focus.' },
  { value: 'sidebarFeatured', label: 'Sidebar Featured', description: 'Main lead story with ranked supporting sidebar.' },
  { value: 'quoteSpotlight', label: 'Quote Spotlight', description: 'Pull-quote and perspective from the desk.' },
  { value: 'multimediaStrip', label: 'Multimedia Strip', description: 'Baris khusus untuk video, podcast, dan audio.' },
];

export const defaultLayoutTemplate: NewsLayoutTemplate = {
  id: 'homepage-default',
  name: 'Homepage Default Layout',
  target: 'homepage',
  status: 'Draft',
  sections: [
    {
      id: 'lead-story',
      title: 'Lead Story',
      component: 'hero',
      responsive: { md: '1', desktop: 'feature' },
      dataSource: { category: 'All', status: 'Published', featuredOnly: true, sortBy: 'latest', limit: 1 },
    },
    {
      id: 'latest-grid',
      title: 'Latest Reports',
      component: 'grid',
      responsive: { md: '2', desktop: '4' },
      dataSource: { category: 'All', status: 'All', featuredOnly: false, sortBy: 'latest', limit: 4 },
    },
    {
      id: 'editorial-table',
      title: 'Editorial Queue',
      component: 'table',
      responsive: { md: '1', desktop: '3' },
      dataSource: { category: 'All', status: 'All', featuredOnly: false, sortBy: 'popular', limit: 5 },
    },
  ],
};

export function createLayoutSection(component: LayoutComponent = 'grid'): NewsLayoutSection {
  const defaultTitle: Record<LayoutComponent, string> = {
    hero: 'New Hero Section',
    grid: 'New Article Grid',
    list: 'New List Stream',
    table: 'New Data Table',
    featureSplit: 'New Feature Split',
    carousel: 'New Carousel',
    magazineCover: 'New Magazine Cover',
    sidebarFeatured: 'New Sidebar Featured',
    quoteSpotlight: 'New Quote Spotlight',
    multimediaStrip: 'New Multimedia Strip',
  };
  const defaultLimit: Record<LayoutComponent, number> = {
    hero: 1,
    grid: 4,
    list: 5,
    table: 5,
    featureSplit: 4,
    carousel: 5,
    magazineCover: 3,
    sidebarFeatured: 5,
    quoteSpotlight: 1,
    multimediaStrip: 4,
  };
  return {
    id: `section-${Date.now()}`,
    title: defaultTitle[component],
    component,
    responsive: { md: component === 'hero' || component === 'magazineCover' || component === 'quoteSpotlight' ? '1' : '2', desktop: component === 'hero' ? 'feature' : component === 'magazineCover' ? '3' : '3' },
    dataSource: { category: 'All', status: 'All', featuredOnly: component === 'hero', sortBy: 'latest', limit: defaultLimit[component] },
  };
}
