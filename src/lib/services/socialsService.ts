import type { SelectSocial } from '@/db/schema/socials';
import type {
  InsertFormSocial,
  UpdateFormSocial,
} from '@/schemas/db/socials';
import BaseDbService from './BaseDbService';

class SocialsService extends BaseDbService<
  InsertFormSocial,
  UpdateFormSocial,
  SelectSocial
> {
  constructor() {
    super('/api/socials');
  }
}

export const socialsService = new SocialsService();
