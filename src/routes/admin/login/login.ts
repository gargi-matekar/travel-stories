// src/routes/admin/login/login.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function loginAdmin(request: Request) {
  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { password } = body
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) {
    console.error('[POST /api/admin/login] ADMIN_SECRET is not set')
    return NextResponse.json(
      { error: 'Server misconfiguration: ADMIN_SECRET not set' },
      { status: 500 }
    )
  }

  if (!password || password !== adminSecret) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  // One httpOnly cookie — the server reads it directly on API routes.
  // The client never needs to touch or send the secret.
  cookies().set('admin_token', adminSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  console.log('[POST /api/admin/login] Admin logged in successfully')
  return NextResponse.json({ success: true })
}