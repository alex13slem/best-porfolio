import { ResponseErrorData, uploadFile } from '@/lib/utils';
import type { Session } from '@supabase/supabase-js';
import type { ZodSchema } from 'zod';

export async function processFormValidation<T>(
  request: Request,
  schema: ZodSchema<T>
) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const validatedForm = schema.safeParse(data);
  if (!validatedForm.success) {
    return {
      data: null,
      error: new ResponseErrorData(validatedForm.error.errors),
    };
  }
  return { data: validatedForm.data, error: null };
}

export async function handleFileUploads<
  T extends Record<string, any>
>(
  validatedData: T,
  session: Session,
  uploadUrl: string
): Promise<Record<string, any>> {
  const uploadResults: Record<string, any> = {};
  await Promise.all(
    Object.entries(validatedData).map(async ([key, value]) => {
      if (value instanceof File && value.type.startsWith('image/')) {
        try {
          const response = await uploadFile(
            value,
            'images',
            session.access_token,
            uploadUrl
          );
          if (response instanceof ResponseErrorData) {
            throw new Error('File upload failed', {
              cause: response.errors,
            });
          }
          uploadResults[key] = response;
        } catch (error) {
          console.error(
            `Error uploading file for key ${key}:`,
            error
          );
          throw new Error('File upload failed', { cause: error });
        }
      }
    })
  );
  return uploadResults;
}
