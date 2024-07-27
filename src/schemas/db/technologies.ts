import { technologiesTable } from '@/db/schema';
import { regex } from '@/lib/utils';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { selectProjectsSchema } from './projects';

//* INSERT
export const insertDbTechnologiesSchema = createInsertSchema(
  technologiesTable,
  {
    name: () => z.string({ required_error: 'Name is required' }),
    slug: () =>
      z
        .string({ required_error: 'Slug is required' })
        .min(3, 'Slug must be at least 3 characters'),
    description: () =>
      z.string({ required_error: 'Description is required' }),
    body: () => z.string({ required_error: 'Body is required' }),
    link: () =>
      z
        .string({ required_error: 'Link is required' })
        .regex(regex.URL, 'Link must be a valid URL'),
    iconifyId: () =>
      z
        .string({ required_error: 'Iconify ID is required' })
        .regex(
          regex.ICONIFY_ID,
          'Link must be a valid Iconify Tailwind ID'
        ),
    image: () =>
      z
        .string({ required_error: 'Image is required' })
        .regex(regex.URL, 'Image must be a valid URL'),
  }
);
export const insertFormTechnologiesSchema =
  insertDbTechnologiesSchema.extend({
    image: z.instanceof(File, { message: 'Image is required' }),
  });
export const insertEndpointTechnologiesSchema =
  insertFormTechnologiesSchema;

//* UPDATE
export const updateDbTechnologiesSchema =
  insertDbTechnologiesSchema.partial();
export const updateFormTechnologiesSchema =
  insertDbTechnologiesSchema.extend({
    image: z
      .instanceof(File, { message: 'Image is required' })
      .optional(),
  });
export const updateEndpointTechnologiesSchema =
  updateFormTechnologiesSchema.partial().extend({
    id: z.preprocess(
      (val) => (typeof val === 'string' ? +val : val),
      z.number()
    ),
  });

//* SELECT
export const selectTechnologiesSchema =
  createSelectSchema(technologiesTable);
export const selectTechnologiesWRelationsSchema =
  selectTechnologiesSchema.extend({
    technologiesToProjects: z.array(
      z.object({
        technologyId: z.number(),
        projectId: z.number(),
        project: z.lazy(() => selectProjectsSchema),
      })
    ),
  });
export const selectTechnologiesTransformedSchema =
  selectTechnologiesSchema.extend({
    projects: z.array(z.lazy(() => selectProjectsSchema)),
  });

//* TYPES
export type InsertFormTechnology = z.infer<
  typeof insertFormTechnologiesSchema
>;
export type InsertDbTechnology = z.infer<
  typeof insertDbTechnologiesSchema
>;

export type UpdateFormTechnology = z.infer<
  typeof updateFormTechnologiesSchema
>;
export type UpdateEndpointTechnology = z.infer<
  typeof updateEndpointTechnologiesSchema
>;
export type UpdateDbTechnology = z.infer<
  typeof updateDbTechnologiesSchema
>;

export type SelectTechnologyWRelations = z.infer<
  typeof selectTechnologiesWRelationsSchema
>;
export type SelectTechnologyTransformed = z.infer<
  typeof selectTechnologiesTransformedSchema
>;
