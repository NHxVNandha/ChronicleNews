import { apiClient } from './apiClient';

export type ActivityLogItem = {
  id: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  description: string;
  createdAt: string;
};

export type ActivityLogFilter = {
  userId?: string;
  action?: string;
  entityType?: string;
  page?: number;
  pageSize?: number;
};

export async function getActivityLogs(filter?: ActivityLogFilter) {
  const params = new URLSearchParams();
  if (filter?.userId) params.set('userId', filter.userId);
  if (filter?.action) params.set('action', filter.action);
  if (filter?.entityType) params.set('entityType', filter.entityType);
  params.set('page', String(filter?.page ?? 1));
  params.set('pageSize', String(filter?.pageSize ?? 20));

  return apiClient<ActivityLogItem[]>(`/api/activity-logs?${params.toString()}`);
}
