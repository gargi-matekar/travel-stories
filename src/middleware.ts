// src/middleware.ts
// Only protects admin PAGE routes — API routes verify the cookie themselves
// via verifyAdmin() in src/routes/admin/auth/verifyAdmin.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin page routes only (not API routes — they self-verify)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const adminToken = request.cookies.get('admin_token')?.value
    const adminSecret = process.env.ADMIN_SECRET

    if (!adminSecret || adminToken !== adminSecret) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}