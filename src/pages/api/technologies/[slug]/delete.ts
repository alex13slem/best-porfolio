import { technologiesTable } from '@/db/schema';
import db from '@/lib/drizzle/client';
import { createAstroServerClient } from '@/lib/supabase/createAstroServerClient';
import {
  getUser,
  json,
  ResponseErrorData,
  ResponseSuccessData,
} from '@/lib/utils';
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const DELETE: APIRoute = async (ctx) => {
  const { params } = ctx;

  const slug = params.slug as string;

  const supabase = createAstroServerClient(ctx);

  const user = await getUser(supabase);
  if (!user) {
    return json(new ResponseErrorData(['User not logged in']), {
      status: 401,
    });
  }

  try {
    await db
      .delete(technologiesTable)
      .where(eq(technologiesTable.slug, slug));
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating project:\n', error);
    return json(new ResponseErrorData([errMessage]), {
      status: 500,
    });
  }

  return json(new ResponseSuccessData(null));
};
