import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import { UserModel } from '@/domain/models/user';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';
import { makeFakeProduct } from './db-mock-helper-product';
import { makeFakeCategory } from './db-mock-helper-category';

export const makeUserMongoRepository = (): UserMongoRepository => {
  class UserRepositoryStub implements UserMongoRepository {
    async getAll(): Promise<UserModel[]> {
      return Promise.resolve([makeFakeUser()]);
    }
    async findByEmail(email: string): Promise<UserModel> {
      return Promise.resolve({} as UserModel);
    }
    async create(payload: AddUserModel): Promise<UserModel> {
      return Promise.resolve(makeFakeUser());
    }
  }

  return new UserRepositoryStub();
};

export const makeUserFakeRequest = () => ({
  name: 'John Doe',
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const makeFakeUser = () => ({
  id: '65bd52691a0f4c3b57819a4b',
  email: 'any@mail.com',
  name: 'John Doe',
  password: 'hashed_password',
  categories: [makeFakeCategory()],
  products: [makeFakeProduct()],
});
