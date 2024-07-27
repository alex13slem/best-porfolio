import { projectsTable } from '@/db/schema';
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
import { updateTechnologiesToProjects } from '@/lib/utils/updateTechnologiesToProjects';
import {
  updateEndpointProjectsSchema,
  type UpdateDbProject,
} from '@/schemas/db/projects';
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

  const validatedForm = updateEndpointProjectsSchema.safeParse(data);
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

  const { technologiesIds } = validatedData;
  const uploadUrl = url.origin + '/api/upload-files';

  try {
    const uploadResults = await handleFileUploads(
      validatedData,
      session,
      uploadUrl
    );
    const updateDbData: UpdateDbProject = {
      ...validatedData,
      thumbnailGreeting: undefined,
      thumbnailPreview: undefined,
      ...uploadResults,
    };

    if (Object.keys(updateDbData).length) {
      await db
        .update(projectsTable)
        .set(updateDbData)
        .where(eq(projectsTable.slug, slug));
    }
    await updateTechnologiesToProjects(
      validatedData.id!,
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
