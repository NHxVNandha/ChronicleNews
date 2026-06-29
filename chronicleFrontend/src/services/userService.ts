import { apiClient } from './apiClient';

export type RoleRecord = {
  id: string;
  name: string;
  description: string;
};

export type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited' | 'Disabled';
  lastLoginAt?: string | null;
  createdAt: string;
};

type PagedUsersResponse = UserRecord[];

export async function getRoles() {
  return apiClient<RoleRecord[]>('/api/roles');
}

export async function getUsers(page = 1, pageSize = 50) {
  return apiClient<PagedUsersResponse>(`/api/users?page=${page}&pageSize=${pageSize}`);
}

export async function updateUserRole(id: string, payload: { fullName: string; roleId: string }) {
  return apiClient<UserRecord>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateUserStatus(id: string, status: UserRecord['status']) {
  return apiClient<string>(`/api/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
