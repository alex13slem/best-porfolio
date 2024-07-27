import type {
  SelectProjectTransformed,
  SelectProjectWRelations,
} from '@/schemas/db/projects';

export function transformProject(
  input: SelectProjectWRelations
): SelectProjectTransformed {
  const { technologiesToProjects, ...rest } = input;

  const technologies = technologiesToProjects.map((tp) => tp.technology);

  return {
    ...rest,
    technologies,
  };
}
