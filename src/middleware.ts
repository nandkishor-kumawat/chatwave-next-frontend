import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
    const baseUrl = req.nextUrl.origin;
    const pathname = req.nextUrl.pathname;
    const isAuthRoute = ['/login', '/signup'].includes(pathname);

    const { user } = await fetch(`${baseUrl}/api/auth/session`, {
        headers: {
            cookie: req.headers.get('cookie') as string
        }
    }).then(res => res.json());

    /** User is logged in and on auth page */
    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/chat', req.url))
    }

    /** User neither logged in nor on auth page */
    if (!isAuthRoute && !user) {
        return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url))
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        // "/((?!about|contact|login|signup).{1,})",
        // '/((?!api|_next/static|_next/image|favicon.ico).*)'
        '/login',
        '/signup',
        '/chat/:path*',
        '/call/:path*'
    ],
}