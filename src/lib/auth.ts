import { createClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function isAdmin(userId?: string) {
  if (!userId) return false

  const supabase = await createClient()

  // 方法1: 檢查 profiles 表中的 is_admin 欄位
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  if (profile?.is_admin) return true

  // 方法2: 檢查是否為預設管理員 email
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL

  return user?.email === adminEmail
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('未登入')
  }

  const isUserAdmin = await isAdmin(user.id)
  if (!isUserAdmin) {
    throw new Error('需要管理員權限')
  }

  return user
}
