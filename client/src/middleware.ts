import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  const visited = response.cookies.get('esa-visited');
  if (!visited) {
    response.cookies.set('esa-visited', 'true', {
      httpOnly: true,
      path: '/',
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });
  }
  return response;
}

export const config = {
  matcher: '/home',
};
