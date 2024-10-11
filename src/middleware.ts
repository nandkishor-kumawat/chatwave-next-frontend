import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
    const baseUrl = req.nextUrl.origin;
    const pathname = req.nextUrl.pathname;

    const res = await fetch(`${baseUrl}/api/auth/session`, {
        headers: {
            cookie: req.headers.get('cookie') as string
        }
    })

    const session = await res.json();

    if (!session?.user) {
        if (['/login', '/signup'].includes(pathname)) {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url))
    }

    return NextResponse.next();
}




export const config = {
    matcher: [
        // "/((?!about|contact|login|signup).{1,})",
        // '/((?!api|_next/static|_next/image|favicon.ico).*)'
        '/',
        '/login',
        '/signup',
        '/chat/:path*',
        // '/call/:path*'
    ],
}