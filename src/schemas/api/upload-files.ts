import { z } from 'zod';

export const uploadFilesSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .nonempty({ message: 'At least one file is required' }),
  bucketId: z.string({ required_error: 'Bucket is required' }),
});

export type UploadFiles = z.infer<typeof uploadFilesSchema>;

export type UploadFileData = {
  url: string;
  id: string;
  path: string;
  fullPath: string;
};
