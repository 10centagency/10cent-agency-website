import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

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

  // If no user and trying to access /admin routes, redirect to auth
  if (!user) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
