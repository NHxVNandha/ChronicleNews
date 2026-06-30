import type { Category } from '../categoryService';
import type { BackendCategory } from '../models/articleModels';

export function mapCategory(category: BackendCategory, index: number): Category {
  const tones = ['bg-secondary', 'bg-slate-500', 'bg-red-600', 'bg-emerald-600'];
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? '',
    count: 0,
    tone: tones[index % tones.length],
    slug: category.slug,
    isActive: category.isActive,
  };
}
