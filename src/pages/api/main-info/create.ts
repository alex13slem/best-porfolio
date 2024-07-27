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
  insertEndpointMainInfoSchema,
  type InsertDbMainInfo,
} from '@/schemas/db/main-info';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const { request, url } = ctx;
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

  const validatedForm = insertEndpointMainInfoSchema.safeParse(data);
  if (!validatedForm.success) {
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
    const insertDbData: InsertDbMainInfo = {
      ...validatedData,
      openGraphImage: '',
      ...uploadResults,
    };

    await db.insert(mainInfoTable).values(insertDbData);
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error create main info:', errMessage);
    return json(new ResponseErrorData([errMessage]), {
      status: 500,
    });
  }
  return json(new ResponseSuccessData(null));
};
