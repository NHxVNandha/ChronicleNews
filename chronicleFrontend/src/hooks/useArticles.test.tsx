import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useArticles } from './useArticles';

const { mockedGetArticles } = vi.hoisted(() => ({
  mockedGetArticles: vi.fn(),
}));

vi.mock('../services', async () => {
  const actual = await vi.importActual<typeof import('../services')>('../services');
  return {
    ...actual,
    getArticles: mockedGetArticles,
  };
});

describe('useArticles', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    mockedGetArticles.mockResolvedValue([
      {
        slug: 'architecture-of-truth',
        title: 'The Architecture of Truth',
        summary: 'Summary',
        category: 'Technology',
        date: 'July 1, 2026',
        author: 'Editor',
        readTime: '5 min read',
        image: '',
        status: 'Published',
        updatedAt: 'Today',
        views: '128K',
      },
    ]);
  });

  function createWrapper() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return function Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  }

  it('loads public articles successfully', async () => {
    const { result } = renderHook(() => useArticles({ sort: 'newest', limit: 5 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetArticles).toHaveBeenCalledWith({ sort: 'newest', limit: 5 });
    expect(result.current.articles).toHaveLength(1);
    expect(result.current.error).toBe('');
  });

  it('maps article load failures to a readable error', async () => {
    mockedGetArticles.mockRejectedValueOnce(new Error('Network down'));

    const { result } = renderHook(() => useArticles({ sort: 'newest', limit: 5 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles).toEqual([]);
    expect(result.current.error).toBe('Network down');
  });
});
