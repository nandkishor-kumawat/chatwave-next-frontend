export { default } from 'next-auth/middleware'



export const config = { 
    matcher: [
        "/((?!about|contact|login|signup).{1,})",
        // '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ],
}