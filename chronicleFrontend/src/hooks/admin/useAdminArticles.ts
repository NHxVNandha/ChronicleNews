import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import type { Article } from '../../data';
import { getArticles, type ArticleFilter } from '../../services';

export function useAdminArticles(filter?: ArticleFilter) {
  const [articles, setArticles] = useState<Article[]>([]);
  const filterKey = useMemo(() => JSON.stringify(filter ?? {}), [filter]);
  const articlesQuery = useQuery({
    queryKey: ['articles', filterKey],
    queryFn: () => getArticles(filter),
  });

  useEffect(() => {
    if (articlesQuery.data) {
      setArticles(articlesQuery.data);
    }
  }, [articlesQuery.data]);

  const error = articlesQuery.error instanceof Error ? articlesQuery.error.message : articlesQuery.error ? 'Failed to load articles.' : '';

  return { articles, setArticles, loading: articlesQuery.isLoading, error };
}
