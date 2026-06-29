import type { MediaAsset } from '../data';
import { apiClient } from './apiClient';

type BackendMediaAsset = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  image: string;
  usageCount: number;
  altStatus: boolean;
  credit: string;
  license: string;
  category: string;
};

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const items = await apiClient<BackendMediaAsset[]>('/api/media');
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    size: item.size,
    date: item.date,
    image: item.image,
    usageCount: item.usageCount,
    altStatus: item.altStatus,
    credit: item.credit,
    license: item.license,
    category: item.category,
  }));
}
