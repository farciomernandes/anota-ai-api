import { AdminModel } from '@/core/domain/models/admin';
import { AddAdmin } from '@/presentation/dtos/admin/add-admin';

export abstract class IDbAddAdminRepository {
  abstract create(payload: AddAdmin): Promise<AdminModel>;
}
