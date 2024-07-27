import { relations } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { technologiesToProjectsTable } from './technologies-to-projects';

export const technologiesTable = pgTable('technologies', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  body: text('body').notNull(),
  link: text('link').notNull(),
  iconifyId: varchar('iconify_id', { length: 255 }).notNull(),
  image: text('image').notNull(),
});

export const technologiesRelations = relations(
  technologiesTable,
  ({ many }) => ({
    technologiesToProjects: many(technologiesToProjectsTable),
  })
);

export type InsertTechnologies =
  typeof technologiesTable.$inferInsert;
export type SelectTechnology = typeof technologiesTable.$inferSelect;
