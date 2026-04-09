const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

function getInlineCsrfToken() {
  if (typeof document === 'undefined') return '';
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('lms_csrf_token='))
    ?.slice('lms_csrf_token='.length) || '';
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method || 'GET').toUpperCase();
  const csrfToken = ['GET', 'HEAD', 'OPTIONS'].includes(method) ? '' : getInlineCsrfToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...(init?.headers || {}),
    },
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(json?.error?.message || json?.message || 'API request failed');
  }
  return json.data as T;
}
