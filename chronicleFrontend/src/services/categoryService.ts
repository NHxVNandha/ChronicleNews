import { apiClient } from './apiClient';

export type Category = {
  id: string;
  name: string;
  description: string;
  count?: number;
  tone?: string;
  slug?: string;
  isActive?: boolean;
};

export async function getCategories(): Promise<Category[]> {
  const categories = await apiClient<Array<{ id: string; name: string; description?: string | null; slug: string; isActive: boolean }>>('/api/categories');
  const tones = ['bg-secondary', 'bg-slate-500', 'bg-red-600', 'bg-emerald-600'];
  return categories.map((category, index) => ({
    id: category.id,
    name: category.name,
    description: category.description ?? '',
    count: 0,
    tone: tones[index % tones.length],
    slug: category.slug,
    isActive: category.isActive,
  }));
}
