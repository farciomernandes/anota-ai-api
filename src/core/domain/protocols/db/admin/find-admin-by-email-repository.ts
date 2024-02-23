import { AdminModel } from '@/core/domain/models/admin';

export abstract class IDbFindAdminByEmailRepository {
  abstract findByEmail(email: string): Promise<AdminModel>;
}
