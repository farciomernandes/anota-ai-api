import { AdminModel } from '@/core/domain/models/admin';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';

export abstract class IDbDeleteAdminRepository {
  abstract delete(id: string, user: Authenticated): Promise<AdminModel>;
}
