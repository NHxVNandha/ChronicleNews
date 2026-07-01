import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminLayout } from './AdminLayout';

const {
  mockedNavigate,
  mockedUseAuth,
  mockedGetArticles,
} = vi.hoisted(() => ({
  mockedNavigate: vi.fn(),
  mockedUseAuth: vi.fn(),
  mockedGetArticles: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: mockedUseAuth,
}));

vi.mock('../services', async () => {
  const actual = await vi.importActual<typeof import('../services')>('../services');
  return {
    ...actual,
    getArticles: mockedGetArticles,
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('../components/admin', async () => {
  const actual = await vi.importActual<typeof import('../components/admin')>('../components/admin');
  return {
    ...actual,
    AdminCommandPalette: ({ open, articles, isLoadingArticles, onNavigate }: { open: boolean; articles: Array<{ slug: string; title: string }>; isLoadingArticles: boolean; onNavigate: (path: string) => void }) =>
      open ? (
        <div>
          <div>Command Palette</div>
          <div>{isLoadingArticles ? 'Loading articles...' : `Articles: ${articles.length}`}</div>
          <button type="button" onClick={() => onNavigate('/admin')}>Go Dashboard</button>
        </div>
      ) : null,
  };
});

describe('AdminLayout', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      user: { id: '1', fullName: 'Admin User', email: 'admin@chronicle.press', role: 'Admin', status: 'Active' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    mockedGetArticles.mockResolvedValue([
      {
        slug: 'architecture-of-truth',
        title: 'The Architecture of Truth',
        status: 'Draft',
        category: 'Technology',
      },
    ]);
  });

  function renderLayout(children = <div>Page Content</div>) {
    return render(
      <MemoryRouter>
        <AdminLayout title="Overview">{children}</AdminLayout>
      </MemoryRouter>,
    );
  }

  it('opens command palette on Ctrl+K', async () => {
    renderLayout();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));

    expect(await screen.findByText('Command Palette')).toBeInTheDocument();
  });

  it('opens command palette when quick search is clicked', async () => {
    renderLayout();

    fireEvent.click(screen.getByTestId('admin-command-trigger'));

    expect(await screen.findByText('Command Palette')).toBeInTheDocument();
  });

  it('does not open command palette while typing in an input', () => {
    renderLayout(<input aria-label="dummy-input" />);

    const input = screen.getByLabelText('dummy-input');
    input.focus();

    fireEvent.keyDown(input, { key: 'k', ctrlKey: true, bubbles: true });

    expect(screen.queryByText('Command Palette')).not.toBeInTheDocument();
  });

  it('fetches article commands only on first open', async () => {
    renderLayout();

    fireEvent.click(screen.getByTestId('admin-command-trigger'));
    await screen.findByText('Command Palette');
    fireEvent.click(screen.getByText('Go Dashboard'));

    fireEvent.click(screen.getByTestId('admin-command-trigger'));
    await screen.findByText('Command Palette');

    await waitFor(() => {
      expect(mockedGetArticles).toHaveBeenCalledTimes(1);
    });
  });

  it('navigates when a command is selected', async () => {
    renderLayout();

    fireEvent.click(screen.getByTestId('admin-command-trigger'));
    fireEvent.click(await screen.findByText('Go Dashboard'));

    expect(mockedNavigate).toHaveBeenCalledWith('/admin');
  });
});
