import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdminCommandPalette } from './AdminCommandPalette';

describe('AdminCommandPalette', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders static command groups', () => {
    const onNavigate = vi.fn();

    render(
      <AdminCommandPalette
        open
        onOpenChange={vi.fn()}
        articles={[]}
        isLoadingArticles={false}
        onNavigate={onNavigate}
      />,
    );

    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Editorial')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
  });

  it('shows empty state when no command matches', () => {
    render(
      <AdminCommandPalette
        open
        onOpenChange={vi.fn()}
        articles={[]}
        isLoadingArticles={false}
        onNavigate={vi.fn()}
      />,
    );

    fireEvent.change(screen.getAllByPlaceholderText('Search pages, actions, or articles...')[0], {
      target: { value: 'no-match-keyword' },
    });

    expect(screen.getByText('No matching commands')).toBeInTheDocument();
  });

  it('renders article results and navigates on select', () => {
    const onNavigate = vi.fn();

    render(
      <AdminCommandPalette
        open
        onOpenChange={vi.fn()}
        articles={[
          {
            slug: 'architecture-of-truth',
            title: 'The Architecture of Truth',
            status: 'Draft',
            category: 'Technology',
          },
        ]}
        isLoadingArticles={false}
        onNavigate={onNavigate}
      />,
    );

    expect(screen.getByText('The Architecture of Truth')).toBeInTheDocument();
    fireEvent.click(screen.getByText('The Architecture of Truth'));
    expect(onNavigate).toHaveBeenCalledWith('/admin/articles/architecture-of-truth/edit');
  });

  it('shows loading state while articles are loading', () => {
    render(
      <AdminCommandPalette
        open
        onOpenChange={vi.fn()}
        articles={[]}
        isLoadingArticles
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByText('Loading articles...')).toBeInTheDocument();
  });
});
