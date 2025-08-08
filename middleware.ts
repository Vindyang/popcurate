// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
// import { verifySession } from '@/lib/betterauth/client'; // Uncomment if Better Auth provides a helper

export async function middleware(request: NextRequest) {
  // Example: Use Better Auth's session verification if available
  // const session = await verifySession(request);

  // Next.js convention: check for a session cookie (replace with Better Auth's cookie name if different)
  const session = request.cookies.get('betterauth_session');

  if (!session) {
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Optionally, add user info to request headers for downstream usage
  // request.headers.set('x-user-id', session.userId);

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ['/app/:path*'],
};
