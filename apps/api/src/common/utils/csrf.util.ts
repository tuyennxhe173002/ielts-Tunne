import { randomBytes, timingSafeEqual } from 'crypto';
import type { Request, Response } from 'express';

const COOKIE_NAME = 'lms_csrf_token';

export function issueCsrfToken() {
  return randomBytes(24).toString('hex');
}

export function setCsrfCookie(response: Response, token: string) {
  response.cookie(COOKIE_NAME, token, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearCsrfCookie(response: Response) {
  response.clearCookie(COOKIE_NAME, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export function getCsrfCookieName() {
  return COOKIE_NAME;
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.cookie || '';
  return header
    .split(';')
    .map((part: string) => part.trim())
    .find((part: string) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1) || '';
}

export function validateCsrf(request: Request) {
  const cookieToken = readCookie(request, COOKIE_NAME);
  const headerToken = `${request.headers['x-csrf-token'] || ''}`;
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;
  return timingSafeEqual(Buffer.from(cookieToken, 'utf8'), Buffer.from(headerToken, 'utf8'));
}
