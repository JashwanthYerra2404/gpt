import { NextResponse } from 'next/server'
import { verifySession } from '@/app/lib/dal' // your DAL layer for session validation

// Define which routes require authentication
const protectedRoutes = ['/chat']

export async function proxy(req) {
  const path = req.nextUrl.pathname

  // Only run for protected routes
  if (!protectedRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next()
  }

  // Check session using DAL
  const session = await verifySession()

  if (!session?.userId) {
    // No valid session → redirect to login
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Allow access
  return NextResponse.next()
}

// Define which routes to match
export const config = {
  matcher: ['/chat/:path*'],
}
