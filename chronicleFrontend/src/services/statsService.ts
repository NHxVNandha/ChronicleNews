import { stats } from '../data';
import { simulateDelay } from './apiClient';

export type Stat = (typeof stats)[number];

export async function getStats(): Promise<Stat[]> {
  return simulateDelay([...stats]);
}
