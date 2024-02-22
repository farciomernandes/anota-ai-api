import { RoleModel } from '@/core/domain/models/role';
import { IDbListRoleRepository } from '@/core/domain/protocols/db/role/list-role-respository';
import { RoleMongoRepository } from '@/infra/db/mongodb/role/role-mongo-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbListRole implements IDbListRoleRepository {
  constructor(private readonly roleMongoRepository: RoleMongoRepository) {}

  async getAll(): Promise<RoleModel[]> {
    return this.roleMongoRepository.getAll();
  }
}
