const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5228';

type ApiEnvelope<T> = {
  data: T;
  meta?: unknown;
};

function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('chronicle.accessToken');
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = API_BASE ? `${API_BASE}${endpoint}` : endpoint;
  const token = getAccessToken();
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `API error: ${response.status} ${response.statusText}`;
    try {
      const errorPayload = await response.json() as { error?: { message?: string } };
      message = errorPayload.error?.message ?? message;
    } catch {
      // Ignore non-JSON error body.
    }

    throw new Error(message);
  }

  const payload = await response.json() as ApiEnvelope<T> | T;
  return (payload as ApiEnvelope<T>).data ?? payload as T;
}

export function simulateDelay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
