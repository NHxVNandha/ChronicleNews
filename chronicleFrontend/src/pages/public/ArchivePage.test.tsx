import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ArchivePage } from './ArchivePage';

vi.mock('../../hooks/useArticles', () => ({
  useArticles: vi.fn(),
}));

vi.mock('../../hooks/useCategories', () => ({
  useCategories: vi.fn(),
}));

import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';

describe('ArchivePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPage() {
    return render(
      <MemoryRouter>
        <ArchivePage />
      </MemoryRouter>,
    );
  }

  it('filters archive entries by search query and section', () => {
    vi.mocked(useArticles).mockReturnValue({
      articles: [
        { slug: 'tech-story', title: 'Technology Breakthrough', summary: 'Tech summary', category: 'Technology', date: 'July 1, 2026', author: 'Editor', readTime: '5 min read', image: '/a.jpg', status: 'Published', updatedAt: 'Today', views: '10K' },
        { slug: 'economy-story', title: 'Economic Outlook', summary: 'Economy summary', category: 'Economy', date: 'July 1, 2026', author: 'Reporter', readTime: '4 min read', image: '/b.jpg', status: 'Published', updatedAt: 'Today', views: '7K' },
      ],
      loading: false,
      error: '',
    });

    vi.mocked(useCategories).mockReturnValue({
      categories: [
        { id: 'cat-1', name: 'Technology', slug: 'technology', description: 'Technology desk' },
        { id: 'cat-2', name: 'Economy', slug: 'economy', description: 'Economy desk' },
      ],
      loading: false,
      error: '',
    });

    renderPage();

    fireEvent.change(screen.getByPlaceholderText('Search the archive...'), { target: { value: 'Technology' } });
    expect(screen.getByText('Technology Breakthrough')).toBeInTheDocument();
    expect(screen.queryByText('Economic Outlook')).not.toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('All Sections'), { target: { value: 'Economy' } });
    expect(screen.queryByText('Technology Breakthrough')).not.toBeInTheDocument();
    expect(screen.queryByText('Economic Outlook')).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Search the archive...'), { target: { value: '' } });
    expect(screen.getByText('Economic Outlook')).toBeInTheDocument();
  });

  it('renders combined error state', () => {
    vi.mocked(useArticles).mockReturnValue({ articles: [], loading: false, error: 'Archive articles failed.' });
    vi.mocked(useCategories).mockReturnValue({ categories: [], loading: false, error: '' });

    renderPage();

    expect(screen.getByText('Archive articles failed.')).toBeInTheDocument();
  });
});
