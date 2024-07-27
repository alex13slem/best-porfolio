import { technologiesTable } from '@/db/schema';
import { transformTechnology } from '@/lib/utils/technologies/transforms';
import { eq } from 'drizzle-orm';
import db from '../client';

export async function getTechnologies() {
  return await db.query.technologiesTable.findMany();
}

export async function getTechnologyBySlug(slug: string) {
  const technology = await db.query.technologiesTable.findFirst({
    where: eq(technologiesTable.slug, slug),
    with: {
      technologiesToProjects: {
        with: {
          project: true,
        },
      },
    },
  });
  return technology ? transformTechnology(technology) : null;
}
