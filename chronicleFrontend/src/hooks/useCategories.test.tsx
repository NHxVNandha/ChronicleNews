import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCategories } from './useCategories';

const { mockedGetCategories } = vi.hoisted(() => ({
  mockedGetCategories: vi.fn(),
}));

vi.mock('../services', async () => {
  const actual = await vi.importActual<typeof import('../services')>('../services');
  return {
    ...actual,
    getCategories: mockedGetCategories,
  };
});

describe('useCategories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    mockedGetCategories.mockResolvedValue([
      { id: 'cat-1', name: 'Technology', slug: 'technology' },
      { id: 'cat-2', name: 'Politics', slug: 'politics' },
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

  it('loads categories successfully', async () => {
    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetCategories).toHaveBeenCalledTimes(1);
    expect(result.current.categories).toHaveLength(2);
    expect(result.current.error).toBe('');
  });

  it('maps category load failures to a readable error', async () => {
    mockedGetCategories.mockRejectedValueOnce(new Error('Category request failed'));

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBe('Category request failed');
  });
});
