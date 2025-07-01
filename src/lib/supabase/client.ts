import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Detect if we're running on localhost
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  const cookieOptions = {
    // Let browser handle domain automatically - don't set domain
    sameSite: 'lax' as const,
    secure: !isLocalhost, // Only use secure cookies in production
    path: '/',
  }

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Supabase client config:', {
      hostname: window.location.hostname,
      isLocalhost,
      cookieOptions
    })
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions,
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  )
}
