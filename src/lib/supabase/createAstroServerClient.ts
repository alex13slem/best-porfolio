import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { APIContext, AstroGlobal } from 'astro';

export function createAstroServerClient(
  context: AstroGlobal | APIContext
) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(
            context.request.headers.get('Cookie') ?? ''
          );
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            context.cookies.set(name, value, options)
          );
        },
      },
      // auth: {
      //   persistSession: false,
      //   flowType: 'pkce',
      // },
    }
  );
}
