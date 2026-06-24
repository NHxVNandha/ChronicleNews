import { categories } from '../data';
import { simulateDelay } from './apiClient';

export type Category = (typeof categories)[number];

export async function getCategories(): Promise<Category[]> {
  return simulateDelay([...categories]);
}
