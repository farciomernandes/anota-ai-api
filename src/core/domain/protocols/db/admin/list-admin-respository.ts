import { AdminModel } from '@/core/domain/models/admin';

export abstract class IDbListAdminRepository {
  abstract getAll(): Promise<AdminModel[]>;
}
