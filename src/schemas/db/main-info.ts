import { mainInfoTable } from '@/db/schema';
import { regex } from '@/lib/utils';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

//* INSERT
export const insertDbMainInfoSchema = createInsertSchema(
  mainInfoTable,
  {
    email: () =>
      z
        .string({ required_error: 'Email is required' })
        .email('Email is invalid'),
    phone: () =>
      z
        .string({ required_error: 'Phone is required' })
        .regex(regex.PHONE, 'Phone is invalid'),

    heroEpithets: z
      .array(z.string())
      .min(1, 'Hero epithets are required'),
    heroGreeting: () =>
      z.string({ required_error: 'Hero greeting is required' }),
    aboutHero: () =>
      z.string({ required_error: 'About hero is required' }),

    openGraphImage: () =>
      z
        .string({ required_error: 'Open Graph image is required' })
        .regex(regex.URL, 'Open Graph image must be a valid URL'),
    siteName: () =>
      z.string({ required_error: 'Site name is required' }),
    siteDescription: () =>
      z.string({ required_error: 'Site description is required' }),
  }
);
export const insertFormMainInfoSchema = insertDbMainInfoSchema.extend(
  {
    openGraphImage: z.instanceof(File, {
      message: 'Open Graph image is required',
    }),
  }
);
export const insertEndpointMainInfoSchema =
  insertFormMainInfoSchema.extend({
    heroEpithets: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.string())
    ),
  });

// * UPDATE
export const updateDbMainInfoSchema =
  insertDbMainInfoSchema.partial();
export const updateFormMainInfoSchema = insertDbMainInfoSchema.extend(
  {
    openGraphImage: z
      .instanceof(File, { message: 'Open Graph image is required' })
      .optional(),
  }
);
export const updateEndpointMainInfoSchema = updateFormMainInfoSchema
  .partial()
  .extend({
    heroEpithets: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.string())
    ),
    id: z.preprocess(
      (val) => (typeof val === 'string' ? +val : val),
      z.number()
    ),
  });

// * TYPES
export type InsertDbMainInfo = z.infer<typeof insertDbMainInfoSchema>;
export type InsertFormMainInfo = z.infer<
  typeof insertFormMainInfoSchema
>;
export type InsertEndpointMainInfo = z.infer<
  typeof insertEndpointMainInfoSchema
>;

export type UpdateDbMainInfo = z.infer<typeof updateDbMainInfoSchema>;
export type UpdateFormMainInfo = z.infer<
  typeof updateFormMainInfoSchema
>;
export type UpdateEndpointMainInfo = z.infer<
  typeof updateEndpointMainInfoSchema
>;
