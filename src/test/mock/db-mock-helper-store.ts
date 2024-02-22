import { StoreModel } from '@/core/domain/models/store';
import { makeFakeProduct } from './db-mock-helper-product';
import { makeFakeCategory } from './db-mock-helper-category';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';

export const makeStoreMongoRepository = (): StoreMongoRepository => {
  class StoreRepositoryStub implements StoreMongoRepository {
    async getAll(): Promise<StoreModel[]> {
      return Promise.resolve([makeFakeStore()]);
    }
    async findByEmail(email: string): Promise<StoreModel> {
      return Promise.resolve({} as StoreModel);
    }
    async create(payload: AddStoreModel): Promise<StoreModel> {
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

export const makeFakeStore = () => ({
  id: '65bd52691a0f4c3b57819a4b',
  email: 'any@mail.com',
  name: 'John Doe',
  password: 'hashed_password',
  categories: [makeFakeCategory()],
  products: [makeFakeProduct()],
});
