import { StoreModel } from '@/core/domain/models/store';
import { makeFakeProduct } from './db-mock-helper-product';
import { makeFakeCategory } from './db-mock-helper-category';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { AddStoreModel } from '@/presentation/dtos/role/add-role.dto';
import { CreatedStore } from '@/presentation/dtos/store/created-store';
import { makeFakeRoles } from './db-mock-helper-role';

export const makeStoreMongoRepository = (): StoreMongoRepository => {
  class StoreRepositoryStub implements StoreMongoRepository {
    async getAll(): Promise<StoreModel[]> {
      return Promise.resolve([makeFakeStore()]);
    }
    async findByEmail(email: string): Promise<StoreModel> {
      return Promise.resolve({} as StoreModel);
    }
    async create(payload: AddStoreModel): Promise<CreatedStore> {
      return Promise.resolve(makeFakeStore());
    }
  }

  return new StoreRepositoryStub();
};

export const makeStoreFakeRequest = () => ({
  name: 'John Doe',
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const makeFakeStore = (): StoreModel => {
  const store = new StoreModel();
  store.id = '65bd52691a0f4c3b57819a4b';
  store.email = 'any_email@mail.com';
  store.name = 'John Doe';
  store.password = 'hashed_password';
  store.categories = [makeFakeCategory()];
  store.products = [makeFakeProduct()];
  store.role = makeFakeRoles();

  return store;
};

export const makeRequestAddStore = (): AddStoreModel => {
  const store = new AddStoreModel();
  store.email = 'any_email@mail.com';
  store.name = 'John Doe';
  store.password = 'hashed_password';
  store.roleId = makeFakeRoles().id;

  return store;
};
