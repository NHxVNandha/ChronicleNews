import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Article } from '../data';
import { queryKeys } from '../lib/queryKeys';
import { getArticles, type ArticleFilter } from '../services';

export function useArticles(filter?: ArticleFilter) {
  const filterKey = useMemo(() => JSON.stringify(filter ?? {}), [filter]);
  const articlesQuery = useQuery({
    queryKey: queryKeys.articles.list(filterKey),
    queryFn: () => getArticles(filter),
  });

  const error = articlesQuery.error instanceof Error ? articlesQuery.error.message : articlesQuery.error ? 'Failed to load articles.' : '';

  return {
    articles: articlesQuery.data ?? ([] as Article[]),
    loading: articlesQuery.isLoading,
    error,
  };
}
