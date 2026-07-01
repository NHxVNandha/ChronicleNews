import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect }: { onSelect?: (date: Date) => void }) => (
    <button type="button" onClick={() => onSelect?.(new Date('2026-07-02T00:00:00'))}>Pick July 2</button>
  ),
}));

const {
  mockedToastError,
  mockedToastSuccess,
  mockedGetComments,
  mockedGetCampaigns,
  mockedGetSubscriberSummary,
  mockedCreateCampaign,
  mockedChangeCommentStatus,
  mockedAddCommentReply,
} = vi.hoisted(() => ({
  mockedToastError: vi.fn(),
  mockedToastSuccess: vi.fn(),
  mockedGetComments: vi.fn(),
  mockedGetCampaigns: vi.fn(),
  mockedGetSubscriberSummary: vi.fn(),
  mockedCreateCampaign: vi.fn(),
  mockedChangeCommentStatus: vi.fn(),
  mockedAddCommentReply: vi.fn(),
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
  AdminSectionHeader: ({ title, description }: { title: string; description?: string }) => <div><h3>{title}</h3><p>{description}</p></div>,
  AdminStatCard: ({ label, value }: { label: string; value: string | number }) => <div>{label}:{value}</div>,
  AdminStatusBadge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('../../services', () => ({
  getComments: mockedGetComments,
  getCampaigns: mockedGetCampaigns,
  getSubscriberSummary: mockedGetSubscriberSummary,
  createCampaign: mockedCreateCampaign,
  changeCommentStatus: mockedChangeCommentStatus,
  addCommentReply: mockedAddCommentReply,
}));

describe('AdminEngagementHub', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockedGetComments.mockResolvedValue([
      { id: 'comment-1', author: 'Reader One', text: 'Insightful reporting from Chronicle.', date: '2026-07-01', status: 'Pending', articleTitle: 'Digital Transformation', replies: [] },
    ]);

    mockedGetCampaigns.mockResolvedValue([
      { id: 'camp-1', title: 'Morning Brief', type: 'Newsletter', audience: 'All Subscribers', sent: '2026-07-01', openRate: '24%', status: 'Sent' },
    ]);

    mockedGetSubscriberSummary.mockResolvedValue([
      { tier: 'All Subscribers', count: '28,406', delta: '+3.2%' },
    ]);

    mockedCreateCampaign.mockImplementation(async ({ title, type, audience }) => ({
      id: 'camp-new',
      title,
      type,
      audience,
      sent: null,
      openRate: null,
      status: 'Draft',
    }));

    mockedChangeCommentStatus.mockResolvedValue({});
    mockedAddCommentReply.mockResolvedValue({});
  });

  async function renderEngagementHub() {
    const { AdminEngagementHub } = await import('./AdminEngagementHub');
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <AdminEngagementHub />
      </QueryClientProvider>,
    );
  }

  it('shows validation feedback for invalid push notification form', async () => {
    await renderEngagementHub();

    const pushTitle = await screen.findByPlaceholderText('Breaking: ...');
    fireEvent.change(pushTitle, { target: { value: 'Hey' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Notification' }));

    await waitFor(() => {
      expect(screen.getByText('Notification title must be at least 5 characters.')).toBeInTheDocument();
      expect(screen.getByText('Notification body must be at least 10 characters.')).toBeInTheDocument();
    });
  });

  it('creates newsletter campaign and schedules a social post', async () => {
    await renderEngagementHub();

    const campaignTitle = await screen.findByPlaceholderText('e.g. Weekend Edition');
    fireEvent.change(campaignTitle, { target: { value: 'Weekend Edition' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create & Send' }));

    await waitFor(() => {
      expect(mockedCreateCampaign).toHaveBeenCalledWith({ title: 'Weekend Edition', type: 'Newsletter', audience: 'All Subscribers' });
    });

    expect(mockedToastSuccess).toHaveBeenCalledWith('Campaign created.');
    expect(screen.getByText('"Weekend Edition" will be sent to subscribers.')).toBeInTheDocument();

    const composePostSection = screen.getByText('Compose Post').closest('section');
    const dayPickerTrigger = composePostSection?.querySelector('button[type="button"]');
    expect(dayPickerTrigger).not.toBeNull();

    fireEvent.change(screen.getByPlaceholderText('Write your post...'), { target: { value: 'Chronicle explainer on newsroom automation is live now.' } });
    fireEvent.change(screen.getByDisplayValue('Twitter / X'), { target: { value: 'LinkedIn' } });
    fireEvent.click(dayPickerTrigger as HTMLButtonElement);
    fireEvent.change(screen.getByDisplayValue('09:00'), { target: { value: '09:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Schedule Post' }));

    await waitFor(() => {
      expect(screen.getByText('Chronicle explainer on newsroom automation is live now.')).toBeInTheDocument();
      expect(screen.getAllByText('LinkedIn').length).toBeGreaterThan(0);
    });
  });

  it('rolls back optimistic comment status when mutation fails', async () => {
    mockedChangeCommentStatus.mockRejectedValueOnce(new Error('Status failed'));
    await renderEngagementHub();

    expect(await screen.findByRole('button', { name: 'Approve' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
      expect(mockedToastError).toHaveBeenCalledWith('Failed to update comment status.');
    });
  });

  it('rolls back optimistic campaign creation when mutation fails', async () => {
    mockedCreateCampaign.mockRejectedValueOnce(new Error('Campaign failed'));
    await renderEngagementHub();

    const campaignTitle = await screen.findByPlaceholderText('e.g. Weekend Edition');
    fireEvent.change(campaignTitle, { target: { value: 'Weekend Edition' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create & Send' }));

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith('Failed to create campaign.');
    });
  });
});
