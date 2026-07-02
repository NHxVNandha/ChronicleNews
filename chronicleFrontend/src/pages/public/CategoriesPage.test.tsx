import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoriesPage } from './CategoriesPage';

vi.mock('../../hooks/useArticles', () => ({
  useArticles: vi.fn(),
}));

vi.mock('../../hooks/useCategories', () => ({
  useCategories: vi.fn(),
}));

import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';

describe('CategoriesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPage() {
    return render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>,
    );
  }

  it('renders featured category header and filtered articles', () => {
    vi.mocked(useCategories).mockReturnValue({
      categories: [
        { id: 'cat-1', name: 'Technology', description: 'Technology desk', count: 12, tone: 'bg-secondary' },
        { id: 'cat-2', name: 'Economy', description: 'Economy desk', count: 8, tone: 'bg-emerald-500' },
      ],
      loading: false,
      error: '',
    });

    vi.mocked(useArticles).mockReturnValue({
      articles: [
        { slug: 'a', title: 'Tech Story', summary: 'Summary A', category: 'Technology', date: 'July 1, 2026', author: 'A', readTime: '5 min', image: '/a.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
        { slug: 'b', title: 'Economy Story', summary: 'Summary B', category: 'Economy', date: 'July 1, 2026', author: 'B', readTime: '5 min', image: '/b.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
      ],
      loading: false,
      error: '',
    });

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Technology' })).toBeInTheDocument();
    expect(screen.getByText('Technology desk')).toBeInTheDocument();
    expect(screen.getByText('Tech Story')).toBeInTheDocument();
    expect(screen.queryByText('Economy Story')).not.toBeInTheDocument();
  });

  it('renders combined error state', () => {
    vi.mocked(useCategories).mockReturnValue({ categories: [], loading: false, error: 'Failed categories.' });
    vi.mocked(useArticles).mockReturnValue({ articles: [], loading: false, error: '' });

    renderPage();

    expect(screen.getByText('Failed categories.')).toBeInTheDocument();
  });
});
