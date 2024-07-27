import type { SelectTechnology } from '@/db/schema';
import type {
  InsertFormTechnology,
  UpdateFormTechnology,
} from '@/schemas/db/technologies';
import BaseDbService from './BaseDbService';

class TechnologiesService extends BaseDbService<
  InsertFormTechnology,
  UpdateFormTechnology,
  SelectTechnology
> {
  constructor() {
    super('/api/technologies');
  }
}

export const technologiesService = new TechnologiesService();
