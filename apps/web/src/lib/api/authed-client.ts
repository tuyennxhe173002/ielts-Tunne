import { apiRequest } from './client';
import { clearTokens, getAccessToken, saveAccessToken, saveCsrfToken } from '../auth/token-store';

export async function authedApiRequest<T>(path: string, init?: RequestInit) {
  const execute = (token: string) => apiRequest<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  const accessToken = getAccessToken();
  if (!accessToken) {
    const refreshed = await refreshAccessToken();
    return execute(refreshed);
  }

  try {
    return await execute(accessToken);
  } catch (error) {
    const refreshed = await refreshAccessToken().catch(() => '');
    if (!refreshed) {
      clearTokens();
      throw error;
    }
    return execute(refreshed);
  }
}

async function refreshAccessToken() {
  const data = await apiRequest<{ accessToken: string; csrfToken?: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  saveAccessToken(data.accessToken);
  if (data.csrfToken) saveCsrfToken(data.csrfToken);
  return data.accessToken;
}
