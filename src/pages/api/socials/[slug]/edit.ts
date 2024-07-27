import {
  socialsEnum,
  socialsTable,
  type SocialsEnum,
} from '@/db/schema';
import db from '@/lib/drizzle/client';
import { createAstroServerClient } from '@/lib/supabase/createAstroServerClient';
import {
  getSession,
  getUser,
  json,
  ResponseErrorData,
  ResponseSuccessData,
} from '@/lib/utils';
import { updateEndpointSocialsSchema } from '@/schemas/db/socials';
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const PATCH: APIRoute = async (ctx) => {
  const { request, params } = ctx;

  const slug = params.slug as string;
  const slugIsValid = socialsEnum.enumValues.includes(
    slug as SocialsEnum
  );
  if (!slugIsValid) {
    console.error('Slug not valid:', slug);
    return json(new ResponseErrorData(['Slug not valid']), {
      status: 400,
    });
  }

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

  const validatedForm = updateEndpointSocialsSchema.safeParse(data);

  if (!validatedForm.success) {
    return json(new ResponseErrorData(validatedForm.error.errors), {
      status: 400,
    });
  }

  const validatedData = validatedForm.data;

  try {
    await db
      .update(socialsTable)
      .set(validatedData)
      .where(eq(socialsTable.slug, slug as SocialsEnum));
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error update socials:', errMessage);
    return json(new ResponseErrorData([errMessage]), {
      status: 500,
    });
  }

  return json(new ResponseSuccessData(null));
};
