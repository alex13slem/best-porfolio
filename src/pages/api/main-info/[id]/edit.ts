import { mainInfoTable } from '@/db/schema';
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
  updateEndpointMainInfoSchema,
  type UpdateDbMainInfo,
} from '@/schemas/db/main-info';
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const PATCH: APIRoute = async (ctx) => {
  const { request, params, url } = ctx;

  const id = params.id as string;
  const idIsValid = Number.isInteger(+id);
  if (!idIsValid) {
    console.error('ID not valid');
    return json(new ResponseErrorData(['ID not valid']), {
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

  const validatedForm = updateEndpointMainInfoSchema.safeParse(data);
  if (!validatedForm.success) {
    console.error(
      'Error validating form data:\n',
      validatedForm.error
    );
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
    const updateDbData: UpdateDbMainInfo = {
      ...validatedData,
      openGraphImage: undefined,
      ...uploadResults,
    };

    if (Object.keys(updateDbData).length) {
      await db
        .update(mainInfoTable)
        .set(updateDbData)
        .where(eq(mainInfoTable.id, +id));
    }
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating main info:\n', error);
    return json(new ResponseErrorData([errMessage]), {
      status: 500,
    });
  }

  return json(new ResponseSuccessData(null));
};
