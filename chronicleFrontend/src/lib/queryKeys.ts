export const queryKeys = {
  articles: {
    all: ['articles'] as const,
    list: (filterKey: string) => ['articles', filterKey] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  dashboard: {
    overview: ['dashboard', 'overview'] as const,
  },
  team: {
    access: ['team', 'access'] as const,
  },
  engagement: {
    overview: ['engagement', 'overview'] as const,
  },
  optimization: {
    settings: ['optimization', 'settings'] as const,
  },
};
