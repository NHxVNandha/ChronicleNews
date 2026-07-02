import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthorDetailPage, AuthorsPage } from './AuthorsPage';

vi.mock('../../hooks/useArticles', () => ({
  useArticles: vi.fn(),
}));

import { useArticles } from '../../hooks/useArticles';

describe('AuthorsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders unique author cards from article list', () => {
    vi.mocked(useArticles).mockReturnValue({
      articles: [
        { slug: 'a', title: 'Story A', summary: 'Summary A', category: 'Technology', date: 'July 1, 2026', author: 'Julian Thorne', readTime: '5 min', image: '/a.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
        { slug: 'b', title: 'Story B', summary: 'Summary B', category: 'Technology', date: 'July 1, 2026', author: 'Julian Thorne', readTime: '5 min', image: '/b.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
        { slug: 'c', title: 'Story C', summary: 'Summary C', category: 'Economy', date: 'July 1, 2026', author: 'Mara Ellison', readTime: '5 min', image: '/c.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
      ],
      loading: false,
      error: '',
    });

    render(
      <MemoryRouter>
        <AuthorsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Julian Thorne')).toBeInTheDocument();
    expect(screen.getByText('Mara Ellison')).toBeInTheDocument();
    expect(screen.getAllByText(/View profile/i)).toHaveLength(2);
  });

  it('renders author detail article list for matching slug', () => {
    vi.mocked(useArticles).mockReturnValue({
      articles: [
        { slug: 'a', title: 'Story A', summary: 'Summary A', category: 'Technology', date: 'July 1, 2026', author: 'Julian Thorne', readTime: '5 min', image: '/a.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
        { slug: 'b', title: 'Story B', summary: 'Summary B', category: 'Technology', date: 'July 2, 2026', author: 'Julian Thorne', readTime: '6 min', image: '/b.jpg', status: 'Published', updatedAt: 'Today', views: '2K' },
        { slug: 'c', title: 'Story C', summary: 'Summary C', category: 'Economy', date: 'July 3, 2026', author: 'Mara Ellison', readTime: '5 min', image: '/c.jpg', status: 'Published', updatedAt: 'Today', views: '1K' },
      ],
      loading: false,
      error: '',
    });

    render(
      <MemoryRouter initialEntries={['/authors/julian-thorne']}>
        <Routes>
          <Route path="/authors/:slug" element={<AuthorDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Julian Thorne' })).toBeInTheDocument();
    expect(screen.getByText('Story A')).toBeInTheDocument();
    expect(screen.getByText('Story B')).toBeInTheDocument();
    expect(screen.queryByText('Story C')).not.toBeInTheDocument();
  });
});
