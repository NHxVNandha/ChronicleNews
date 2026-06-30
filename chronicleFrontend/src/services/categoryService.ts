import { apiClient } from './apiClient';
import { mapCategory } from './mappers/categoryMappers';
import type { BackendCategory } from './models/articleModels';

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
  const categories = await apiClient<BackendCategory[]>('/api/categories');
  return categories.map(mapCategory);
}
