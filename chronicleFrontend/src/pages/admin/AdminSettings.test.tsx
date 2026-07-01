import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminSettings } from './AdminSettings';

const {
  mockedToastError,
  mockedToastSuccess,
  mockedUseTeamAccess,
} = vi.hoisted(() => ({
  mockedToastError: vi.fn(),
  mockedToastSuccess: vi.fn(),
  mockedUseTeamAccess: vi.fn(),
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
  AdminPanel: ({ children, title }: { children: React.ReactNode; title?: string }) => <section><h2>{title}</h2>{children}</section>,
  AdminSectionHeader: ({ title, meta }: { title: string; meta?: React.ReactNode }) => <div><h3>{title}</h3>{meta}</div>,
  AdminStatCard: ({ label, value }: { label: string; value: string | number }) => <div>{label}:{value}</div>,
}));

vi.mock('../../hooks/admin/useTeamAccess', () => ({
  useTeamAccess: mockedUseTeamAccess,
}));

describe('AdminSettings', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseTeamAccess.mockReturnValue({
      availableRoles: [
        { id: 'role-admin', name: 'Admin' },
        { id: 'role-editor', name: 'Editor' },
      ],
      teamMembers: [],
      setTeamMembers: vi.fn(),
      loading: false,
      error: '',
      setError: vi.fn(),
    });
  });

  it('shows validation feedback and blocks general save when required fields are invalid', async () => {
    render(<AdminSettings />);

    const publicationName = screen.getByDisplayValue('CHRONICLE');
    fireEvent.change(publicationName, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(screen.getByText('Publication name must be at least 3 characters.')).toBeInTheDocument();
    });

    expect(mockedToastSuccess).not.toHaveBeenCalled();
  });

  it('submits general settings and updates workflow toggle state', async () => {
    render(<AdminSettings />);

    const publicationName = screen.getByDisplayValue('CHRONICLE');
    fireEvent.change(publicationName, { target: { value: 'Chronicle Press' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(mockedToastSuccess).toHaveBeenCalledWith('Workspace profile updated.');
    });

    fireEvent.click(screen.getByRole('button', { name: /Workflow & Publishing/i }));
    expect(screen.getByText('2 / 4 active')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Allow public comments/i }));

    await waitFor(() => {
      expect(screen.getByText('3 / 4 active')).toBeInTheDocument();
    });
  });
});
