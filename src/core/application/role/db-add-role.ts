import { BadRequestException, Injectable } from '@nestjs/common';
import { IDbAddRoleRepository } from '@/core/domain/protocols/db/role/add-role-repository';
import { RoleModel } from '@/core/domain/models/role';
import { RoleRepository } from '@/core/domain/repositories/role-repository';

@Injectable()
export class DbAddRole implements IDbAddRoleRepository {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(payload: Omit<RoleModel, 'id'>): Promise<RoleModel> {
    const alreadyExists = await this.roleRepository.findByValue(payload.value);

    if (alreadyExists && alreadyExists.id) {
      throw new BadRequestException(
        `Already exists a role with ${payload.value} value.`,
      );
    }
    const role = await this.roleRepository.create(payload);

    return role;
  }
}
