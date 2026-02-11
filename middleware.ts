import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Admin Auth Protection
    // Protect /admin routes, excluding /admin/login
    // We do NOT exclude /api/* here because we want to allow public API access by default 
    // (except maybe specific admin APIs, but user asked to exclude /api/* from this check)
    // User instruction: "Матчеры: /admin/:path* исключить /admin/login и /api/*"
    const isApi = path.startsWith("/api/");
    const isAdmin = path.startsWith("/admin");
    const isLogin = path.startsWith("/admin/login");

    if (isAdmin && !isLogin && !isApi) {
        const cookieName = process.env.ADMIN_COOKIE_NAME || "kingdojo_admin";
        const adminCookie = request.cookies.get(cookieName);

        if (!adminCookie) {
            // Redirect to login if no cookie
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
