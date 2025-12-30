import { NextResponse } from 'next/server';

export function middleware(request) {
    // Check if the path starts with /admin/dashboard
    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
        // Check for a cookie or token (Mock: 'admin_auth')
        const authCookie = request.cookies.get('admin_auth');

        if (!authCookie || authCookie.value !== 'true') {
            // Redirect to login
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/admin/dashboard/:path*',
};
