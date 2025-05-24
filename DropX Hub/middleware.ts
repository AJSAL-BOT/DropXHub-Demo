import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // If it's the main admin page, allow it (it has its own authentication)
    if (request.nextUrl.pathname === "/admin") {
      return NextResponse.next()
    }

    // Check if the user is authenticated via a session cookie
    const isAuthenticated = request.cookies.has("admin_authenticated")

    if (!isAuthenticated) {
      // Redirect to the admin login page
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/admin/:path*"],
}
