import type { SelectProject } from '@/db/schema';
import type {
  InsertFormProject,
  UpdateFormProject,
} from '@/schemas/db/projects';
import BaseDbService from './BaseDbService';

class ProjectsService extends BaseDbService<
  InsertFormProject,
  UpdateFormProject,
  SelectProject
> {
  constructor() {
    super('/api/projects');
  }
}

export const projectsService = new ProjectsService();
