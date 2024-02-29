import { Injectable } from '@nestjs/common';
import { IDbFindRoleByEmailRepository } from '../protocols/db/role/find-role-by-value-repository';
import { IDbListRoleRepository } from '../protocols/db/role/list-role-respository';
import { IDbAddRoleRepository } from '../protocols/db/role/add-role-repository';
import { RoleModel } from '../models/role';

@Injectable()
export abstract class RoleRepository
  implements
    IDbAddRoleRepository,
    IDbListRoleRepository,
    IDbFindRoleByEmailRepository
{
  abstract findByValue(value: string): Promise<RoleModel>;
  abstract getAll(): Promise<RoleModel[]>;
  abstract create(payload: Omit<RoleModel, 'id'>): Promise<RoleModel>;
}
