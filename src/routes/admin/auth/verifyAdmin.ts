// src/routes/admin/auth/verifyAdmin.ts
//
// Auth strategy (simple & secure):
// - Login sets one httpOnly cookie: "admin_token" = ADMIN_SECRET value
// - Admin API routes call verifyAdmin() which reads that cookie SERVER-SIDE
//   via Next.js cookies() — httpOnly cookies are fully readable on the server
// - The client never touches the secret at all
// - No Bearer token, no encoding issues, no special-char problems

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export function verifyAdmin(): { error: NextResponse } | null {
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) {
    console.error('[verifyAdmin] ADMIN_SECRET is not set')
    return {
      error: NextResponse.json(
        { error: 'Server misconfiguration: ADMIN_SECRET not set' },
        { status: 500 }
      ),
    }
  }

  const cookieStore = cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token || token !== adminSecret) {
    console.warn('[verifyAdmin] Unauthorized API access attempt')
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }

  return null // null = authorized ✓
}