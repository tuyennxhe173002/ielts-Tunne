const ACCESS_TOKEN_KEY = 'lms_access_token';
const CSRF_TOKEN_KEY = 'lms_csrf_token';

export function saveAccessToken(accessToken: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function saveCsrfToken(csrfToken: string) {
  sessionStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) || '';
}

export function getCsrfToken() {
  const value = sessionStorage.getItem(CSRF_TOKEN_KEY) || '';
  if (value) return value;
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('lms_csrf_token='))
    ?.slice('lms_csrf_token='.length);
  return cookie || '';
}

export function clearTokens() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
}
