import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from './HomePage';

vi.mock('../../hooks/useArticles', () => ({
  useArticles: vi.fn(),
}));

vi.mock('../../hooks/useCategories', () => ({
  useCategories: vi.fn(),
}));

import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPage() {
    return render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
  }

  it('renders featured article, latest reports, and category cards', () => {
    vi.mocked(useArticles).mockReturnValue({
      articles: [
        { slug: 'architecture-of-truth', title: 'The Architecture of Truth', summary: 'Featured summary', category: 'Technology', date: 'July 1, 2026', author: 'Editor', readTime: '5 min read', image: '/hero.jpg', status: 'Published', updatedAt: 'Today', views: '120K' },
        { slug: 'market-pulse', title: 'Market Pulse', summary: 'Second summary', category: 'Economy', date: 'July 1, 2026', author: 'Reporter', readTime: '4 min read', image: '/second.jpg', status: 'Published', updatedAt: 'Today', views: '80K' },
        { slug: 'campus-reimagined', title: 'Campus Reimagined', summary: 'Third summary', category: 'Education', date: 'July 1, 2026', author: 'Reporter', readTime: '6 min read', image: '/third.jpg', status: 'Published', updatedAt: 'Today', views: '52K' },
        { slug: 'climate-ledger', title: 'Climate Ledger', summary: 'Fourth summary', category: 'Policy', date: 'July 1, 2026', author: 'Reporter', readTime: '7 min read', image: '/fourth.jpg', status: 'Published', updatedAt: 'Today', views: '31K' },
        { slug: 'signal-desk', title: 'Signal Desk', summary: 'Fifth summary', category: 'Media', date: 'July 1, 2026', author: 'Reporter', readTime: '3 min read', image: '/fifth.jpg', status: 'Published', updatedAt: 'Today', views: '10K' },
      ],
      loading: false,
      error: '',
    });

    vi.mocked(useCategories).mockReturnValue({
      categories: [
        { id: 'cat-1', name: 'Technology', description: 'Technology desk', count: 12, tone: 'bg-secondary' },
        { id: 'cat-2', name: 'Economy', description: 'Economy desk', count: 8, tone: 'bg-emerald-500' },
      ],
      loading: false,
      error: '',
    });

    renderPage();

    expect(screen.getByText('The Architecture of Truth')).toBeInTheDocument();
    expect(screen.getByText('Latest Reports')).toBeInTheDocument();
    expect(screen.getByText('Market Pulse')).toBeInTheDocument();
    expect(screen.getByText('Technology desk')).toBeInTheDocument();
    expect(screen.getByText('Economy desk')).toBeInTheDocument();
  });

  it('renders combined error banner when article loading fails', () => {
    vi.mocked(useArticles).mockReturnValue({ articles: [], loading: false, error: 'Failed to load articles.' });
    vi.mocked(useCategories).mockReturnValue({ categories: [], loading: false, error: '' });

    renderPage();

    expect(screen.getByText('Failed to load articles.')).toBeInTheDocument();
  });
});
