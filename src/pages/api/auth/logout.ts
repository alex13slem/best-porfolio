import { createAstroServerClient } from '@/lib/supabase/createAstroServerClient';
import { ResponseErrorData, json } from '@/lib/utils';
import type { APIContext } from 'astro';

export const prerender = false;

export const POST = async (ctx: APIContext) => {
  const { rewrite, redirect } = ctx;
  const supabase = createAstroServerClient(ctx);
  const { error } = await supabase.auth.signOut();

  if (error) {
    return json(new ResponseErrorData([error.message]), {
      status: 500,
    });
  }

  await rewrite('/');
  return redirect('/');
};
