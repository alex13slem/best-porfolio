import type {
  SelectTechnologyTransformed,
  SelectTechnologyWRelations,
} from '@/schemas/db/technologies';

export function transformTechnology(
  input: SelectTechnologyWRelations
): SelectTechnologyTransformed {
  const { technologiesToProjects, ...rest } = input;

  const projects = technologiesToProjects.map((tp) => tp.project);

  return {
    ...rest,
    projects,
  };
}
