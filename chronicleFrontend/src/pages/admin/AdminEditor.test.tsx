import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminEditor } from './AdminEditor';

const {
  mockedToastError,
  mockedToastSuccess,
  mockedGetCategories,
  mockedGetArticleEditorBySlug,
  mockedSaveArticle,
  mockedCreateArticle,
  mockedPublishArticle,
} = vi.hoisted(() => ({
  mockedToastError: vi.fn(),
  mockedToastSuccess: vi.fn(),
  mockedGetCategories: vi.fn(),
  mockedGetArticleEditorBySlug: vi.fn(),
  mockedSaveArticle: vi.fn(),
  mockedCreateArticle: vi.fn(),
  mockedPublishArticle: vi.fn(),
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

vi.mock('../../components/AiEditorialAssistant', () => ({
  AiEditorialAssistant: () => <div>AI Assistant</div>,
}));

vi.mock('../../components/ArticlePreviewPanel', () => ({
  ArticlePreviewPanel: () => <div>Preview Panel</div>,
}));

vi.mock('../../components/PublishConfirmModal', () => ({
  PublishConfirmModal: ({ onPublish, onClose }: { onPublish: () => void; onClose: () => void }) => (
    <div>
      <div>Publish Modal</div>
      <button type="button" onClick={onPublish}>Confirm Publish</button>
      <button type="button" onClick={onClose}>Close Publish</button>
    </div>
  ),
}));

vi.mock('../../components/admin', () => ({
  AdminPageHeader: ({ title, actions }: { title: string; actions?: React.ReactNode }) => <div><h1>{title}</h1>{actions}</div>,
  AdminPanel: ({ children, title }: { children: React.ReactNode; title?: string }) => <section><h2>{title}</h2>{children}</section>,
  AdminStatusBadge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('../../services', () => ({
  getCategories: mockedGetCategories,
  getArticleEditorBySlug: mockedGetArticleEditorBySlug,
  saveArticle: mockedSaveArticle,
  createArticle: mockedCreateArticle,
  publishArticle: mockedPublishArticle,
}));

describe('AdminEditor', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockedGetCategories.mockResolvedValue([
      { id: 'cat-1', name: 'Technology', slug: 'technology' },
      { id: 'cat-2', name: 'Politics', slug: 'politics' },
    ]);

    mockedGetArticleEditorBySlug.mockResolvedValue({
      id: 'article-1',
      slug: 'existing-story',
      title: 'Existing Chronicle Story',
      summary: 'This is a valid summary for the editor form.',
      body: 'This is a sufficiently long article body used to exercise the draft save flow in tests.',
      categoryName: 'Technology',
      authorName: 'Julian Thorne',
      featuredImageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
      status: 'Draft',
      featured: false,
    });

    mockedSaveArticle.mockResolvedValue({
      id: 'article-1',
      slug: 'existing-story',
      title: 'Updated Chronicle Story',
      summary: 'This is a valid summary for the editor form.',
      body: 'This is a sufficiently long article body used to exercise the draft save flow in tests.',
      categoryName: 'Technology',
      authorName: 'Julian Thorne',
      featuredImageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
      status: 'Draft',
      featured: false,
    });

    mockedPublishArticle.mockResolvedValue({
      id: 'article-1',
      slug: 'existing-story',
      title: 'Updated Chronicle Story',
      summary: 'This is a valid summary for the editor form.',
      body: 'This is a sufficiently long article body used to exercise the draft save flow in tests.',
      categoryName: 'Technology',
      authorName: 'Julian Thorne',
      featuredImageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
      status: 'Published',
      featured: false,
    });
  });

  function renderEditor() {
    return render(
      <MemoryRouter initialEntries={['/admin/articles/existing-story/edit']}>
        <Routes>
          <Route path="/admin/articles/:slug/edit" element={<AdminEditor />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('shows inline validation and blocks draft save when required fields are invalid', async () => {
    renderEditor();

    const titleInput = await screen.findByPlaceholderText('Enter a compelling headline...');
    const summaryInput = screen.getByPlaceholderText('Write a brief, punchy summary to appear in previews...');
    const bodyInput = screen.getByPlaceholderText('Continue editing this story draft or published article...');

    fireEvent.change(titleInput, { target: { value: 'Short' } });
    fireEvent.change(summaryInput, { target: { value: 'Too short' } });
    fireEvent.change(bodyInput, { target: { value: 'Too short body' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Draft' }));

    await waitFor(() => {
      expect(screen.getByText('Headline must be at least 8 characters.')).toBeInTheDocument();
      expect(screen.getByText('Summary must be at least 20 characters.')).toBeInTheDocument();
      expect(screen.getByText('Article body must be at least 80 characters.')).toBeInTheDocument();
    });

    expect(mockedSaveArticle).not.toHaveBeenCalled();
    expect(mockedCreateArticle).not.toHaveBeenCalled();
  });

  it('saves a valid draft for an existing article', async () => {
    renderEditor();

    const titleInput = await screen.findByPlaceholderText('Enter a compelling headline...');
    fireEvent.change(titleInput, { target: { value: 'Updated Chronicle Story' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Draft' }));

    await waitFor(() => {
      expect(mockedSaveArticle).toHaveBeenCalledWith('existing-story', expect.objectContaining({
        title: 'Updated Chronicle Story',
        category: 'Technology',
        featured: false,
      }));
    });

    expect(mockedToastSuccess).toHaveBeenCalledWith('Draft saved.');
  });

  it('blocks publish modal when required fields are invalid', async () => {
    renderEditor();

    const titleInput = await screen.findByPlaceholderText('Enter a compelling headline...');
    const summaryInput = screen.getByPlaceholderText('Write a brief, punchy summary to appear in previews...');
    const bodyInput = screen.getByPlaceholderText('Continue editing this story draft or published article...');

    fireEvent.change(titleInput, { target: { value: 'Short' } });
    fireEvent.change(summaryInput, { target: { value: 'Too short' } });
    fireEvent.change(bodyInput, { target: { value: 'Too short body' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Publish Now' })[0]);

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith('Complete the required article fields before publishing.');
    });

    expect(screen.queryByText('Publish Modal')).not.toBeInTheDocument();
    expect(mockedPublishArticle).not.toHaveBeenCalled();
  });

  it('publishes a valid existing article after confirmation', async () => {
    renderEditor();

    const titleInput = await screen.findByPlaceholderText('Enter a compelling headline...');
    fireEvent.change(titleInput, { target: { value: 'Updated Chronicle Story' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Publish Now' })[0]);

    expect(await screen.findByText('Publish Modal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Publish' }));

    await waitFor(() => {
      expect(mockedSaveArticle).toHaveBeenCalledWith('existing-story', expect.objectContaining({
        title: 'Updated Chronicle Story',
        featured: false,
      }));
      expect(mockedPublishArticle).toHaveBeenCalledWith('existing-story');
    });

    expect(mockedToastSuccess).toHaveBeenCalledWith('Article published successfully.');
  });
});
