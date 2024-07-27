import { relations } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { technologiesToProjectsTable } from './technologies-to-projects';

export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  body: text('body').notNull(),
  role: text('role').notNull(),
  siteLink: text('site_link').notNull(),
  githubLink: text('github_link').notNull(),
  thumbnailGreeting: text('thumbnail_greeting').notNull(),
  thumbnailPreview: text('thumbnail_preview').notNull(),
});

export const projectsRelations = relations(projectsTable, ({ many }) => ({
  technologiesToProjects: many(technologiesToProjectsTable),
}));

export type SelectProject = typeof projectsTable.$inferSelect;
