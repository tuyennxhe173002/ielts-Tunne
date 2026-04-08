import type { Response } from 'express';

const COOKIE_NAME = 'lms_refresh_token';

export function setRefreshCookie(response: Response, refreshToken: string) {
  response.cookie(COOKIE_NAME, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/v1/auth',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshCookie(response: Response) {
  response.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/v1/auth',
  });
}

export function getRefreshCookieName() {
  return COOKIE_NAME;
}
