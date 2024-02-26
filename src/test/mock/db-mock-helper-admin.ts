import { makeFakeRoles } from './db-mock-helper-role';
import { AdminMongoRepository } from '@/infra/db/mongodb/admin/admin-mongo-repository';
import { AdminModel } from '@/core/domain/models/admin';
import { AddAdmin } from '@/presentation/dtos/admin/add-admin';

export const makeAdminMongoRepository = (): AdminMongoRepository => {
  class AdminRepositoryStub implements AdminMongoRepository {
    findById(id: string): Promise<AdminModel> {
      return Promise.resolve(makeFakeAdmin());
    }
    delete(id: string): Promise<AdminModel> {
      return Promise.resolve(makeFakeAdmin());
    }
    async getAll(): Promise<AdminModel[]> {
      return Promise.resolve([makeFakeAdmin()]);
    }
    async findByEmail(email: string): Promise<AdminModel> {
      return Promise.resolve({} as AdminModel);
    }
    async create(payload: AddAdmin): Promise<AdminModel> {
      return Promise.resolve(makeFakeAdmin());
    }
  }

  return new AdminRepositoryStub();
};

export const makeAdminFakeRequest = (): AddAdmin => ({
  name: 'John Doe',
  email: 'any_email@mail.com',
  password: 'any_password',
  roleId: makeFakeRoles().id,
});

export const makeFakeAdmin = (): AdminModel => {
  const admin = new AdminModel();
  admin.id = '65bd52691a0f4c3b57819a4b';
  admin.email = 'any_email@mail.com';
  admin.name = 'John Doe';
  admin.password = 'hashed_password';
  admin.role = makeFakeRoles();
  return admin;
};
