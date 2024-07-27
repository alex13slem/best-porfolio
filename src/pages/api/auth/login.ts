import { createAstroServerClient } from '@/lib/supabase/createAstroServerClient';
import { ResponseErrorData, ResponseSuccessData, json } from '@/lib/utils';
import { authSchema } from '@/schemas/api/auth';
import type { APIContext } from 'astro';

export const prerender = false;

export const POST = async (ctx: APIContext) => {
  const { request } = ctx;
  const data = await request.json();
  const validationResult = authSchema.safeParse(data);

  if (!validationResult.success) {
    return json(new ResponseErrorData(validationResult.error.errors), {
      status: 400,
    });
  }

  const supabase = createAstroServerClient(ctx);
  const { error, data: authData } = await supabase.auth.signInWithPassword(
    data
  );

  if (error) {
    return json(new ResponseErrorData([error.message]), {
      status: 400,
    });
  }

  return json(new ResponseSuccessData(authData));
};
