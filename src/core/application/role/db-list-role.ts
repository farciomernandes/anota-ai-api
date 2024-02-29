import { RoleModel } from '@/core/domain/models/role';
import { IDbListRoleRepository } from '@/core/domain/protocols/db/role/list-role-respository';
import { RoleRepository } from '@/core/domain/repositories/role-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbListRole implements IDbListRoleRepository {
  constructor(private readonly roleMongoRepository: RoleRepository) {}

  async getAll(): Promise<RoleModel[]> {
    return this.roleMongoRepository.getAll();
  }
}
