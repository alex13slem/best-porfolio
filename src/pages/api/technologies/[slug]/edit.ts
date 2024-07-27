import { technologiesTable } from '@/db/schema';
import db from '@/lib/drizzle/client';
import { handleFileUploads } from '@/lib/helpers/endpoint';
import { createAstroServerClient } from '@/lib/supabase/createAstroServerClient';
import {
  getSession,
  getUser,
  json,
  ResponseErrorData,
  ResponseSuccessData,
} from '@/lib/utils';
import {
  updateEndpointTechnologiesSchema,
  type UpdateDbTechnology,
} from '@/schemas/db/technologies';
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const PATCH: APIRoute = async (ctx) => {
  const { request, params, url } = ctx;

  const slug = params.slug as string;

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

  const validatedForm =
    updateEndpointTechnologiesSchema.safeParse(data);
  if (!validatedForm.success) {
    for (const error of validatedForm.error.errors) {
      console.error(error);
    }
    return json(new ResponseErrorData(validatedForm.error.errors), {
      status: 400,
    });
  }
  const validatedData = validatedForm.data;

  const uploadUrl = url.origin + '/api/upload-files';

  try {
    const uploadResults = await handleFileUploads(
      validatedData,
      session,
      uploadUrl
    );
    const updateData: UpdateDbTechnology = {
      ...validatedData,
      image: undefined,
      ...uploadResults,
    };
    await db
      .update(technologiesTable)
      .set(updateData)
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
