import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminOptimizationHub } from './AdminOptimizationHub';

const {
  mockedToastError,
  mockedToastSuccess,
  mockedGetSeoSettings,
  mockedGetAiSettings,
  mockedUpdateSeoSettings,
  mockedUpdateAiSettings,
} = vi.hoisted(() => ({
  mockedToastError: vi.fn(),
  mockedToastSuccess: vi.fn(),
  mockedGetSeoSettings: vi.fn(),
  mockedGetAiSettings: vi.fn(),
  mockedUpdateSeoSettings: vi.fn(),
  mockedUpdateAiSettings: vi.fn(),
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
  AdminPageHeader: ({ title, actions }: { title: string; actions?: React.ReactNode }) => <div><h1>{title}</h1>{actions}</div>,
  AdminPanel: ({ children, title, action }: { children: React.ReactNode; title?: string; action?: React.ReactNode }) => <section><h2>{title}</h2>{action}{children}</section>,
  AdminSectionHeader: ({ title, description }: { title: string; description?: string }) => <div><h3>{title}</h3><p>{description}</p></div>,
  AdminStatCard: ({ label, value }: { label: string; value: string | number }) => <div>{label}:{value}</div>,
  AdminStatusBadge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('../../services', () => ({
  getSeoSettings: mockedGetSeoSettings,
  getAiSettings: mockedGetAiSettings,
  updateSeoSettings: mockedUpdateSeoSettings,
  updateAiSettings: mockedUpdateAiSettings,
}));

describe('AdminOptimizationHub', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockedGetSeoSettings.mockResolvedValue({
      defaultMetaTitle: 'Chronicle News - Independent Journalism',
      metaDescription: 'Independent journalism for the informed reader across politics, technology, and culture.',
      focusKeyword: 'digital transformation',
      robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://chronicle.news/sitemap.xml',
      enableCrawling: true,
      indexArticlePages: true,
      indexCategoryPages: true,
      noIndexAuthorPages: false,
    });

    mockedGetAiSettings.mockResolvedValue({
      provider: 'OpenAI',
      modelName: 'gpt-4.1',
      baseUrl: 'https://api.openai.com/v1',
      apiKeyHint: 'sk-***',
      temperature: 0.7,
      maxTokens: 1200,
      systemPrompt: 'Act as a careful editorial assistant for Chronicle News.',
      primaryLanguage: 'Indonesian',
      languageStandard: 'KBBI',
      writingStyle: 'Direct and clear',
      tone: 'Professional',
    });

    mockedUpdateSeoSettings.mockImplementation(async (payload) => payload);
    mockedUpdateAiSettings.mockImplementation(async (payload) => payload);
  });

  it('shows validation feedback and blocks save when required optimization fields are invalid', async () => {
    render(<AdminOptimizationHub />);

    await screen.findByText('Optimization Center');
    const defaultMetaTitle = screen.getAllByPlaceholderText('Chronicle News — Independent Journalism')[0];
    fireEvent.change(defaultMetaTitle, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save All Settings' }));

    await waitFor(() => {
      expect(screen.getByText('Default meta title is too short.')).toBeInTheDocument();
    });

    expect(mockedUpdateSeoSettings).not.toHaveBeenCalled();
    expect(mockedUpdateAiSettings).not.toHaveBeenCalled();
  });

  it('saves seo and ai settings with updated form values', async () => {
    render(<AdminOptimizationHub />);

    await screen.findByText('Optimization Center');
    const defaultMetaTitle = screen.getAllByPlaceholderText('Chronicle News — Independent Journalism')[0];
    const focusKeyword = screen.getByPlaceholderText('Enter target keyword...');

    fireEvent.change(defaultMetaTitle, { target: { value: 'Chronicle News - Verified Reporting' } });
    fireEvent.change(focusKeyword, { target: { value: 'newsroom automation' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save All Settings' }));

    await waitFor(() => {
      expect(mockedUpdateSeoSettings).toHaveBeenCalledWith(expect.objectContaining({
        defaultMetaTitle: 'Chronicle News - Verified Reporting',
        focusKeyword: 'newsroom automation',
      }));
      expect(mockedUpdateAiSettings).toHaveBeenCalledWith(expect.objectContaining({
        provider: 'OpenAI',
        modelName: 'gpt-4.1',
      }));
    });

    expect(mockedToastSuccess).toHaveBeenCalledWith('Optimization settings saved.');
  });
});
