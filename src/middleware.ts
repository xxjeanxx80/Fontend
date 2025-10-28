import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;
  const path = req.nextUrl.pathname;

  if (!token && (path.startsWith('/admin') || path.startsWith('/owner') || path.startsWith('/customer'))) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  if (role === 'CUSTOMER' && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/customer', req.url));
  }
  if (role === 'OWNER' && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/owner', req.url));
  }

  if (token && (path.startsWith('/signin') || path.startsWith('/signup'))) {
    switch (role) {
      case 'ADMIN':
        return NextResponse.redirect(new URL('/admin', req.url));
      case 'OWNER':
        return NextResponse.redirect(new URL('/owner', req.url));
      case 'CUSTOMER':
        return NextResponse.redirect(new URL('/customer', req.url));
      default:
        break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};
