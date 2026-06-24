import { mediaAssets, type MediaAsset } from '../data';
import { simulateDelay } from './apiClient';

export async function getMediaAssets(): Promise<MediaAsset[]> {
  return simulateDelay([...mediaAssets]);
}
