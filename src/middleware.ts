import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect pages
  if (pathname === '/' || pathname.startsWith('/analytics')) {
    const authCookie = request.cookies.get('adminAuth')?.value;
    if (authCookie !== 'authenticated') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect API dashboard routes
  if (pathname.startsWith('/api/links')) {
    const authCookie = request.cookies.get('adminAuth')?.value;
    if (authCookie !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/analytics/:path*',
    '/api/links/:path*',
  ],
};
