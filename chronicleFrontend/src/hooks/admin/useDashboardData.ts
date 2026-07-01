import { useQuery } from '@tanstack/react-query';
import type { Article } from '../../data';
import { queryKeys } from '../../lib/queryKeys';
import { getArticles, getDashboardPipeline, getDashboardRecentActivity, getDashboardSummary, type DashboardPipeline, type DashboardRecentActivity, type DashboardSummary } from '../../services';

const defaultSummary: DashboardSummary = { publishedArticles: 0, draftQueue: 0, mediaAssets: 0, monthlyReaders: 0 };
const defaultPipeline: DashboardPipeline = { draft: 0, needsReview: 0, scheduled: 0, published: 0 };

export function useDashboardData() {
  const dashboardQuery = useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: async () => {
      const [summary, pipeline, recentActivity, articles] = await Promise.all([
        getDashboardSummary(),
        getDashboardPipeline(),
        getDashboardRecentActivity(),
        getArticles({ sort: 'popular', limit: 4 }),
      ]);

      return { summary, pipeline, recentActivity, articles };
    },
  });

  const error = dashboardQuery.error instanceof Error ? dashboardQuery.error.message : dashboardQuery.error ? 'Failed to load dashboard data.' : '';

  return {
    summary: dashboardQuery.data?.summary ?? defaultSummary,
    pipeline: dashboardQuery.data?.pipeline ?? defaultPipeline,
    recentActivity: dashboardQuery.data?.recentActivity ?? ([] as DashboardRecentActivity[]),
    articles: dashboardQuery.data?.articles ?? ([] as Article[]),
    loading: dashboardQuery.isLoading,
    error,
  };
}
