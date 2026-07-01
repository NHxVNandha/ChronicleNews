import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminContentHub } from './AdminContentHub';

const {
  mockedToastError,
  mockedToastSuccess,
  mockedDeleteArticle,
  mockedUpdateArticle,
  mockedUseAdminArticles,
} = vi.hoisted(() => ({
  mockedToastError: vi.fn(),
  mockedToastSuccess: vi.fn(),
  mockedDeleteArticle: vi.fn(),
  mockedUpdateArticle: vi.fn(),
  mockedUseAdminArticles: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: mockedToastSuccess,
    error: mockedToastError,
  },
}));

vi.mock('../../layouts/AdminLayout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../components/admin', () => ({
  AdminPageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
  AdminPanel: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  AdminSectionHeader: ({ title }: { title: string }) => <h2>{title}</h2>,
  AdminStatCard: ({ label, value }: { label: string; value: string | number }) => <div>{label}:{value}</div>,
  AdminInfoCard: ({ title }: { title: string }) => <div>{title}</div>,
  AdminStatusBadge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('../../components/ArticleDataTable', () => ({
  ArticleDataTable: ({ articles, onDelete, onPublish }: { articles: Array<{ slug: string; title: string; status: string }>; onDelete?: (slug: string) => void; onPublish?: (slug: string) => void }) => (
    <div>
      {articles.map((article) => (
        <div key={article.slug}>
          <span>{article.title}</span>
          <span>{article.status}</span>
          <button type="button" onClick={() => onPublish?.(article.slug)}>Publish {article.slug}</button>
          <button type="button" onClick={() => onDelete?.(article.slug)}>Delete {article.slug}</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../../hooks/admin/useAdminArticles', () => ({
  useAdminArticles: mockedUseAdminArticles,
}));

vi.mock('../../services', async () => {
  const actual = await vi.importActual<typeof import('../../services')>('../../services');
  return {
    ...actual,
    deleteArticle: mockedDeleteArticle,
    updateArticle: mockedUpdateArticle,
  };
});

describe('AdminContentHub', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAdminArticles.mockImplementation(() => {
      const [articles, setArticles] = React.useState([
        {
          slug: 'existing-story',
          title: 'Existing Story',
          summary: 'Summary',
          category: 'Technology',
          date: 'July 1, 2026',
          author: 'Editor',
          readTime: '5 min read',
          image: '',
          status: 'Draft',
          updatedAt: 'Today',
          views: '0',
        },
      ]);
      return { articles, setArticles, loading: false, error: '' };
    });
  });

  function renderContentHub() {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <AdminContentHub />
      </QueryClientProvider>,
    );
  }

  it('rolls back optimistic publish when mutation fails', async () => {
    mockedUpdateArticle.mockRejectedValue(new Error('Publish failed'));
    renderContentHub();

    expect((await screen.findAllByText('Existing Story')).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Publish existing-story' }));

    await waitFor(() => {
      expect(screen.getByText('Draft')).toBeInTheDocument();
      expect(mockedToastError).toHaveBeenCalledWith('Publish failed');
    });
  });

  it('rolls back optimistic delete when mutation fails', async () => {
    mockedDeleteArticle.mockRejectedValue(new Error('Delete failed'));
    renderContentHub();

    expect((await screen.findAllByText('Existing Story')).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Delete existing-story' }));

    await waitFor(() => {
      expect(screen.getAllByText('Existing Story').length).toBeGreaterThan(0);
      expect(mockedToastError).toHaveBeenCalledWith('Delete failed');
    });
  });
});
