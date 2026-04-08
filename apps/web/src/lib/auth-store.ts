const ACCESS_TOKEN_KEY = 'lms_access_token';

export function saveAccessToken(accessToken: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) || '';
}

export function clearTokens() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}
