import { RoleModel } from '@/core/domain/models/role';

export abstract class IDbFindRoleByEmailRepository {
  abstract findByValue(value: string): Promise<RoleModel>;
}
