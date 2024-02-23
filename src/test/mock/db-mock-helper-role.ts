import { RoleModel } from '@/core/domain/models/role';
import { RolesEnum } from '@/shared/enums/roles.enum';

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
