import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { isAdminEmail } from '@/lib/admin-auth'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check if user has a valid session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. If no user and trying to access /admin routes, redirect to auth
  if (!user) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // 2. If user exists, check email against admin allowlist
  if (!isAdminEmail(user.email)) {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('[Admin Auth Middleware] Failed to sign out unauthorized user:', err)
    }

    const redirectResponse = NextResponse.redirect(new URL('/', req.url))
    // Propagate cookie updates (cleared session) to redirect response
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  // Return response with updated cookies from Supabase auth
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
