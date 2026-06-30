import { useEffect, useMemo, useState } from 'react';
import type { Article } from '../../data';
import { getArticles, type ArticleFilter } from '../../services';

export function useAdminArticles(filter?: ArticleFilter) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filterKey = useMemo(() => JSON.stringify(filter ?? {}), [filter]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getArticles(filter);
        if (isMounted) setArticles(result);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load articles.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [filter, filterKey]);

  return { articles, setArticles, loading, error };
}
