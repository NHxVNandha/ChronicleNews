import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export function invalidateArticles(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
}

export function invalidateDashboard(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
}

export function invalidateTeamAccess(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.team.access });
}

export function invalidateEngagementOverview(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.engagement.overview });
}

export function invalidateOptimizationSettings(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.optimization.settings });
}
