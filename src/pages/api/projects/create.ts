import { projectsTable } from '@/db/schema';
import db from '@/lib/drizzle/client';
import { handleFileUploads } from '@/lib/helpers/endpoint';
import { createAstroServerClient } from '@/lib/supabase/createAstroServerClient';
import {
  ResponseErrorData,
  ResponseSuccessData,
  getSession,
  getUser,
  json,
} from '@/lib/utils';
import { updateTechnologiesToProjects } from '@/lib/utils/updateTechnologiesToProjects';
import {
  insertEndpointProjectsSchema,
  type InsertDbProject,
} from '@/schemas/db/projects';
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
  const validatedForm = insertEndpointProjectsSchema.safeParse(data);
  if (!validatedForm.success) {
    return json(new ResponseErrorData(validatedForm.error.errors), {
      status: 400,
    });
  }
  const validatedData = validatedForm.data;

  const { technologiesIds } = validatedData;
  const uploadUrl = url.origin + '/api/upload-files';

  try {
    const uploadResults = await handleFileUploads(
      validatedData,
      session,
      uploadUrl
    );
    const insertDbData: InsertDbProject = {
      ...validatedData,
      thumbnailGreeting: '',
      thumbnailPreview: '',
      ...uploadResults,
    };

    const savedData = await db
      .insert(projectsTable)
      .values(insertDbData)
      .returning({ id: projectsTable.id });
    await updateTechnologiesToProjects(
      savedData[0].id,
      technologiesIds
    );
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
