import { socialsEnum, socialsTable } from '@/db/schema/socials';
import { regex } from '@/lib/utils';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// * INSERT
export const insertDbSocialsSchema = createInsertSchema(
  socialsTable,
  {
    name: () => z.string({ required_error: 'Name is required' }),
    slug: () =>
      z.enum(socialsEnum.enumValues, {
        required_error: 'Slug is required',
      }),
    url: () =>
      z
        .string({ required_error: 'URL is required' })
        .regex(regex.URL, 'URL must be a valid URL'),
    iconifyId: () =>
      z
        .string({ required_error: 'Iconify ID is required' })
        .regex(
          regex.ICONIFY_ID,
          'Iconify ID must be a valid Iconify Tailwind ID'
        ),
  }
);
export const insertFormSocialsSchema = insertDbSocialsSchema;
export const insertEndpointSocialsSchema = insertFormSocialsSchema;

// * UPDATE
export const updateDbSocialsSchema = insertDbSocialsSchema.partial();
export const updateFormSocialsSchema = insertDbSocialsSchema;
export const updateEndpointSocialsSchema = updateFormSocialsSchema
  .partial()
  .extend({
    id: z.preprocess(
      (val) => (typeof val === 'string' ? +val : val),
      z.number()
    ),
  });

// * TYPES
export type InsertDbSocial = z.infer<typeof insertDbSocialsSchema>;
export type InsertFormSocial = z.infer<
  typeof insertFormSocialsSchema
>;
export type InsertEndpointSocial = z.infer<
  typeof insertEndpointSocialsSchema
>;

export type UpdateDbSocial = z.infer<typeof updateDbSocialsSchema>;
export type UpdateFormSocial = z.infer<
  typeof updateFormSocialsSchema
>;
export type UpdateEndpointSocial = z.infer<
  typeof updateEndpointSocialsSchema
>;
