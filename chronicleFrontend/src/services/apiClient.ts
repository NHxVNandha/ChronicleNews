const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = API_BASE ? `${API_BASE}${endpoint}` : endpoint;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
  return response.json() as Promise<T>;
}

export function simulateDelay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
