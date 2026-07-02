import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewsPage } from './NewsPage';

vi.mock('../../hooks/useArticles', () => ({
  useArticles: vi.fn(),
}));

import { useArticles } from '../../hooks/useArticles';

describe('NewsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPage() {
    return render(
      <MemoryRouter>
        <NewsPage />
      </MemoryRouter>,
    );
  }

  it('renders top stories and latest news', () => {
    vi.mocked(useArticles).mockReturnValue({
      articles: [
        { slug: 'a', title: 'Story A', summary: 'Summary A', category: 'Tech', date: 'July 1, 2026', author: 'A', readTime: '5 min', image: '/a.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
        { slug: 'b', title: 'Story B', summary: 'Summary B', category: 'World', date: 'July 1, 2026', author: 'B', readTime: '5 min', image: '/b.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
        { slug: 'c', title: 'Story C', summary: 'Summary C', category: 'Policy', date: 'July 1, 2026', author: 'C', readTime: '5 min', image: '/c.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
        { slug: 'd', title: 'Story D', summary: 'Summary D', category: 'Media', date: 'July 1, 2026', author: 'D', readTime: '5 min', image: '/d.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
      ],
      loading: false,
      error: '',
    });

    renderPage();

    expect(screen.getByText('Top Stories')).toBeInTheDocument();
    expect(screen.getByText('Latest News')).toBeInTheDocument();
    expect(screen.getByText('Story A')).toBeInTheDocument();
    expect(screen.getByText('Story D')).toBeInTheDocument();
  });

  it('renders error banner', () => {
    vi.mocked(useArticles).mockReturnValue({ articles: [], loading: false, error: 'Failed to load news.' });

    renderPage();

    expect(screen.getByText('Failed to load news.')).toBeInTheDocument();
  });
});
