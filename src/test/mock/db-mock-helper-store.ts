import { StoreModel } from '@/core/domain/models/store';
import { makeFakeProduct } from './db-mock-helper-product';
import { makeFakeCategory } from './db-mock-helper-category';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { CreatedStore } from '@/presentation/dtos/store/created-store';
import { makeFakeRoles } from './db-mock-helper-role';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';

export const makeStoreMongoRepository = (): StoreMongoRepository => {
  class StoreRepositoryStub implements StoreMongoRepository {
    update(
      id: string,
      payload: Omit<AddStoreModel, 'ownerId'>,
    ): Promise<StoreModel> {
      return Promise.resolve({
        ...makeFakeStore(),
        ...makeFakeUpdateStore(),
      });
    }
    findById(id: string): Promise<StoreModel> {
      return Promise.resolve(makeFakeStore());
    }
    delete(id: string): Promise<StoreModel> {
      return Promise.resolve(makeFakeStore());
    }
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

export const makeStoreFakeRequest = (): AddStoreModel => ({
  email: 'any_email@mail.com',
  name: 'John Doe',
  password: 'new_password',
  roleId: '65b9a4cd77e2de47acb5db37',
  address: 'Rua das Pizzas, Bairro Saboroso, N 12',
  cep: '12345-678',
  phone: '(11) 9876-5432',
});

export const makeFakeUpdateStore = (): AddStoreModel => ({
  email: 'invalid_mail@mail.com',
  name: 'new_name',
  password: 'new_password',
  roleId: 'valid_role_id',
  address: 'Rua das Pizzas, Bairro Saboroso, N 12',
  cep: '12345-678',
  phone: '(11) 9876-5432',
  file: 'https://example.com/new_profile.jpg',
});

export const makeFakeStore = (): StoreModel => {
  const store = new StoreModel();
  store.id = '65bd52691a0f4c3b57819a4b';
  store.email = 'any_email@mail.com';
  store.name = 'John Doe';
  store.password = 'hashed_password';
  store.address = 'Rua das Pizzas, Bairro Saboroso, N 12';
  store.cep = '12345-678';
  store.phone = '(11) 9876-5432';
  store.categories = [makeFakeCategory()];
  store.products = [makeFakeProduct()];
  store.file = 'https://example.com/profile.jpg';
  store.role = makeFakeRoles();

  return store;
};

export const makeRequestAddStore = (): AddStoreModel => {
  const store = new AddStoreModel();
  store.email = 'any_email@mail.com';
  store.name = 'John Doe';
  store.password = 'hashed_password';
  store.address = 'Rua das Pizzas, Bairro Saboroso, N 12';
  store.cep = '12345-678';
  store.phone = '(11) 9876-5432';
  store.file = 'https://example.com/profile.jpg';
  store.roleId = makeFakeRoles().id;

  return store;
};
