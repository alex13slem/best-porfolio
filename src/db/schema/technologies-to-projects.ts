import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { projectsTable } from './projects';
import { technologiesTable } from './technologies';

export const technologiesToProjectsTable = pgTable(
  'technologies_to_projects',
  {
    technologyId: integer('technology_id')
      .notNull()
      .references(() => technologiesTable.id, { onDelete: 'cascade' }),
    projectId: integer('project_id')
      .notNull()
      .references(() => projectsTable.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.technologyId, t.projectId] }),
  })
);

export const technologiesToProjectsRelations = relations(
  technologiesToProjectsTable,
  ({ one }) => ({
    technology: one(technologiesTable, {
      fields: [technologiesToProjectsTable.technologyId],
      references: [technologiesTable.id],
    }),
    project: one(projectsTable, {
      fields: [technologiesToProjectsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export type InsertTechnologiesToProjects =
  typeof technologiesToProjectsTable.$inferInsert;
export type SelectTechnologiesToProjects =
  typeof technologiesToProjectsTable.$inferSelect;
