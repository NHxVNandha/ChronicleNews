import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getCategories, type Category } from '../services';

export function useCategories() {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
  });

  const error = categoriesQuery.error instanceof Error ? categoriesQuery.error.message : categoriesQuery.error ? 'Failed to load categories.' : '';

  return {
    categories: categoriesQuery.data ?? ([] as Category[]),
    loading: categoriesQuery.isLoading,
    error,
  };
}
