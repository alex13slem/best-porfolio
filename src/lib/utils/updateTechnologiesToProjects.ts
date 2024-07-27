import { sql } from 'drizzle-orm';
import db from '../drizzle/client';

export async function updateTechnologiesToProjects(
  projectId: string | number,
  technologyIds: number[]
) {
  const technologyIdsArray = `{${technologyIds.join(',')}}`; // Форматируем массив для SQL

  await db.execute(sql`
    SELECT update_technologies_to_projects(${projectId}, ${technologyIdsArray}::INTEGER[]);
  `);
}
