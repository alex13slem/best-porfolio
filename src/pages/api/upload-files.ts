import { createAstroServerClient } from '@/lib/supabase/createAstroServerClient';
import {
  ResponseErrorData,
  ResponseSuccessData,
  json,
} from '@/lib/utils';
import { uploadFilesSchema } from '@/schemas/api/upload-files';
import type { APIContext } from 'astro';

export const prerender = false;

export async function POST(ctx: APIContext) {
  const { request } = ctx;

  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return json(new ResponseErrorData(['User not logged in']), {
      status: 401,
    });
  }

  const supabase = createAstroServerClient(ctx);
  supabase.auth.setSession({
    access_token: token,
    refresh_token: token,
  });

  const formData = await request.formData();

  const input = {
    files: formData.getAll('files') as File[],
    bucketId: formData.get('bucketId') as string,
  };

  const parsedInput = uploadFilesSchema.safeParse(input);

  if (!parsedInput.success) {
    return json(new ResponseErrorData(parsedInput.error.errors), {
      status: 400,
    });
  }

  const { files, bucketId } = parsedInput.data;

  const uploadPromises = files.map((file) =>
    supabase.storage.from(bucketId).upload(file.name, file)
  );

  try {
    const uploadResults = await Promise.all(uploadPromises);
    console.log('Upload results:', uploadResults);

    const uploadedFiles = uploadResults.map((result, index) => {
      let url: string;
      if (result.error) {
        if ((result.error as any).statusCode == 409) {
          url = `${import.meta.env.SUPABASE_BUCKET_URL}/${bucketId}/${
            files[index].name
          }`;
        } else {
          throw result.error;
        }
      } else {
        url = `${import.meta.env.SUPABASE_BUCKET_URL}/${
          result.data.fullPath
        }`;
      }

      return { ...result.data, url };
    });

    return json(new ResponseSuccessData(uploadedFiles));
  } catch (error: any) {
    console.error('General error:', error);
    return json(new ResponseErrorData([error.message]), {
      status: error.status || error.response?.status || 500,
    });
  }
}
