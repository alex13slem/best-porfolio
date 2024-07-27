import { projectsTable } from '@/db/schema';
import { transformProject } from '@/lib/utils/projects/transforms';
import { eq } from 'drizzle-orm';
import db from '../client';

export async function getProjectsWithTechnologies() {
  return (
    await db.query.projectsTable.findMany({
      with: {
        technologiesToProjects: {
          with: {
            technology: true,
          },
        },
      },
    })
  ).map(transformProject);
}

export async function getProjects() {
  return await db.query.projectsTable.findMany();
}

export async function getProjectBySlug(slug: string) {
  const project = await db.query.projectsTable.findFirst({
    where: eq(projectsTable.slug, slug),
    with: {
      technologiesToProjects: {
        with: {
          technology: true,
        },
      },
    },
  });

  return project ? transformProject(project) : null;
}
