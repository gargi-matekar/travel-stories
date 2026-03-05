// src/app/api/admin/login/route.ts
import { loginAdmin } from '@/routes/admin/login/login'
import { logoutAdmin } from '@/routes/admin/login/logout'

export const POST = loginAdmin
export const DELETE = logoutAdmin