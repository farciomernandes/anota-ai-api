import { RoleModel } from '@/core/domain/models/role';
import { RoleMongoRepository } from '@/infra/db/mongodb/role/role-mongo-repository';
import { RolesEnum } from '@/shared/enums/roles.enum';

export const makeRoleMongoRepository = (): RoleMongoRepository => {
  class RoleRepositoryStub implements RoleMongoRepository {
    async getAll(): Promise<RoleModel[]> {
      return Promise.resolve([makeFakeRoles()]);
    }
    async findByValue(value: string): Promise<RoleModel> {
      return Promise.resolve({} as RoleModel);
    }
    async create(payload: Omit<RoleModel, 'id'>): Promise<RoleModel> {
      return Promise.resolve(makeFakeRoles());
    }
  }

  return new RoleRepositoryStub();
};

export const makeFakeRoles = (): RoleModel => {
  const role = new RoleModel();
  role.id = '65b9a4cd77e2de47acb5db37';
  role.label = 'Role de acesso a todas as funcionalidades do sistema';
  role.value = RolesEnum.ADMIN;
  return role;
};

export const makeRequestAddRole = (): RoleModel => {
  const role = new RoleModel();
  role.label = 'Role de acesso a todas as funcionalidades do sistema';
  role.value = RolesEnum.ADMIN;
  return role;
};
