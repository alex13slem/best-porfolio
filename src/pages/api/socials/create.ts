import { socialsTable } from '@/db/schema';
import db from '@/lib/drizzle/client';
import { createAstroServerClient } from '@/lib/supabase/createAstroServerClient';
import {
  getSession,
  getUser,
  json,
  ResponseErrorData,
  ResponseSuccessData,
} from '@/lib/utils';
import { insertEndpointSocialsSchema } from '@/schemas/db/socials';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;

  const supabase = createAstroServerClient(ctx);
  const user = await getUser(supabase);
  const session = await getSession(supabase);
  if (!user || !session?.access_token) {
    return json(new ResponseErrorData(['User not logged in']), {
      status: 401,
    });
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const validatedForm = insertEndpointSocialsSchema.safeParse(data);

  if (!validatedForm.success) {
    return json(new ResponseErrorData(validatedForm.error.errors), {
      status: 400,
    });
  }

  const validatedData = validatedForm.data;

  try {
    await db.insert(socialsTable).values(validatedData);
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error create socials:', errMessage);

    return json(new ResponseErrorData([errMessage]), {
      status: 500,
    });
  }

  return json(new ResponseSuccessData(null));
};
