import { apiClient } from './apiClient';

export type CommentStatus = 'Pending' | 'Approved' | 'Hidden' | 'Flagged';

export type ModerationComment = {
  id: string;
  text: string;
  articleTitle: string;
  author: string;
  date: string;
  status: CommentStatus;
  replies: { id: string; author: string; text: string; date: string }[];
};

export type Campaign = {
  id: string;
  title: string;
  type: 'Push' | 'Email' | 'Newsletter';
  audience: string;
  sent: string;
  status: 'Sent' | 'Scheduled' | 'Draft';
  openRate?: string;
};

export type SubscriberSummary = {
  tier: string;
  count: string;
  delta: string;
};

export async function getComments(status?: CommentStatus) {
  const query = status ? `?status=${status}` : '';
  return apiClient<ModerationComment[]>(`/api/comments${query}`);
}

export async function changeCommentStatus(id: string, status: CommentStatus) {
  return apiClient<ModerationComment>(`/api/comments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function addCommentReply(id: string, text: string) {
  return apiClient<{ id: string; author: string; text: string; date: string }>(`/api/comments/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function getCampaigns() {
  return apiClient<Campaign[]>('/api/campaigns');
}

export async function createCampaign(payload: { title: string; type: 'Push' | 'Email' | 'Newsletter'; audience: string }) {
  return apiClient<Campaign>('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getSubscriberSummary() {
  return apiClient<SubscriberSummary[]>('/api/subscribers/summary');
}
