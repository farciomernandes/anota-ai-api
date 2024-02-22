import { RoleModel } from '@/core/domain/models/role';

export abstract class IDbListRoleRepository {
  abstract getAll(): Promise<RoleModel[]>;
}
