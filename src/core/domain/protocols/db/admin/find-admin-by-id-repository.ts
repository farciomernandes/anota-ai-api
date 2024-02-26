import { AdminModel } from '@/core/domain/models/admin';

export abstract class IDbFindAdminByIdRepository {
  abstract findById(id: string): Promise<AdminModel>;
}
