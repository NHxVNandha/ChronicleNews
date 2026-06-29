import { apiClient } from './apiClient';

export type DashboardSummary = {
  publishedArticles: number;
  draftQueue: number;
  mediaAssets: number;
  monthlyReaders: number;
};

export type DashboardPipeline = {
  draft: number;
  needsReview: number;
  scheduled: number;
  published: number;
};

export type DashboardRecentActivity = {
  action: string;
  title: string;
  user: string;
  time: string;
};

export async function getDashboardSummary() {
  return apiClient<DashboardSummary>('/api/dashboard/summary');
}

export async function getDashboardPipeline() {
  return apiClient<DashboardPipeline>('/api/dashboard/pipeline');
}

export async function getDashboardRecentActivity() {
  return apiClient<DashboardRecentActivity[]>('/api/dashboard/recent-activity');
}
