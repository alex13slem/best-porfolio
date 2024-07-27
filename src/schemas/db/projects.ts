import { projectsTable } from '@/db/schema';
import { regex } from '@/lib/utils';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { selectTechnologiesSchema } from './technologies';

//* INSERT
export const insertDbProjectsSchema = createInsertSchema(
  projectsTable,
  {
    name: () => z.string({ required_error: 'Name is required' }),
    slug: () =>
      z
        .string({ required_error: 'Slug is required' })
        .min(3, 'Slug must be at least 3 characters'),
    role: () => z.string({ required_error: 'Role is required' }),
    siteLink: () =>
      z
        .string({ required_error: 'Site link is required' })
        .regex(regex.URL, 'Site link must be a valid URL'),
    githubLink: () =>
      z
        .string({ required_error: 'GitHub link is required' })
        .regex(regex.URL, 'GitHub link must be a valid URL'),
    thumbnailPreview: () =>
      z
        .string({ required_error: 'Thumbnail preview is required' })
        .regex(regex.URL, 'Thumbnail must be a valid URL'),
    thumbnailGreeting: () =>
      z
        .string({ required_error: 'Thumbnail greeting is required' })
        .regex(regex.URL, 'Thumbnail must be a valid URL'),
    description: () =>
      z.string({ required_error: 'Description is required' }),
    body: () => z.string({ required_error: 'Body is required' }),
  }
);
export const insertFormProjectsSchema = insertDbProjectsSchema.extend(
  {
    thumbnailPreview: z.instanceof(File, {
      message: 'Thumbnail preview is required',
    }),
    thumbnailGreeting: z.instanceof(File, {
      message: 'Thumbnail greeting is required',
    }),
    technologiesIds: z.array(z.number()),
  }
);
export const insertEndpointProjectsSchema =
  insertFormProjectsSchema.extend({
    technologiesIds: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.number())
    ),
  });

//* UPDATE
export const updateDbProjectsSchema =
  insertDbProjectsSchema.partial();
export const updateFormProjectsSchema = insertDbProjectsSchema.extend(
  {
    thumbnailPreview: z
      .instanceof(File, { message: 'Thumbnail preview is required' })
      .optional(),
    thumbnailGreeting: z
      .instanceof(File, { message: 'Thumbnail greeting is required' })
      .optional(),
    technologiesIds: z.array(z.number()),
  }
);
export const updateEndpointProjectsSchema = updateFormProjectsSchema
  .partial()
  .extend({
    technologiesIds: z.preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(z.number())
    ),
    id: z.preprocess(
      (val) => (typeof val === 'string' ? +val : val),
      z.number()
    ),
  });

//* SELECT
export const selectProjectsSchema = createSelectSchema(projectsTable);
export const selectProjectsWRelationsSchema =
  selectProjectsSchema.extend({
    technologiesToProjects: z.array(
      z.object({
        technologyId: z.number(),
        projectId: z.number(),
        technology: z.lazy(() => selectTechnologiesSchema),
      })
    ),
  });
export const selectProjectsTransformedSchema =
  selectProjectsSchema.extend({
    technologies: z.array(z.lazy(() => selectTechnologiesSchema)),
  });

//* TYPES
export type InsertFormProject = z.infer<
  typeof insertFormProjectsSchema
>;
export type InsertDbProject = z.infer<typeof insertDbProjectsSchema>;

export type UpdateFormProject = z.infer<
  typeof updateFormProjectsSchema
>;
export type UpdateEndpointProject = z.infer<
  typeof updateEndpointProjectsSchema
>;
export type UpdateDbProject = z.infer<typeof updateDbProjectsSchema>;

export type SelectProjectWRelations = z.infer<
  typeof selectProjectsWRelationsSchema
>;
export type SelectProjectTransformed = z.infer<
  typeof selectProjectsTransformedSchema
>;
