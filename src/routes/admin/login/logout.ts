// src/routes/admin/login/logout.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function logoutAdmin() {
  cookies().delete('admin_token')
  console.log('[DELETE /api/admin/login] Admin logged out')
  return NextResponse.json({ success: true })
}