import { RoleModel } from '@/core/domain/models/role';

export abstract class IDbAddRoleRepository {
  abstract create(payload: Omit<RoleModel, 'id'>): Promise<RoleModel>;
}
