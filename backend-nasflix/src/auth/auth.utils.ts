import { Response } from 'express';

export function setAuthCookies(res: Response, tokens: any) {
  res.cookie('access_token', tokens.access_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refresh_token', tokens.refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
