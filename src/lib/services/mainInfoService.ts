import type { SelectMainInfo } from '@/db/schema';
import type {
  InsertFormMainInfo,
  UpdateFormMainInfo,
} from '@/schemas/db/main-info';
import BaseDbService from './BaseDbService';

class MainInfoService extends BaseDbService<
  InsertFormMainInfo,
  UpdateFormMainInfo,
  SelectMainInfo
> {
  constructor() {
    super('/api/main-info');
  }
}

export const mainInfoService = new MainInfoService();
