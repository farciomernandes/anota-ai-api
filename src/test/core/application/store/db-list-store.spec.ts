import { DbListStore } from '@/core/application/store/db-list-store';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import {
  makeFakeStore,
  makeStoreMongoRepository,
} from '@/test/mock/db-mock-helper-store';

type SutTypes = {
  sut: DbListStore;
  listStoreRepositoryStub: StoreMongoRepository;
};

const makeSut = (): SutTypes => {
  const listStoreRepositoryStub = makeStoreMongoRepository();
  const sut = new DbListStore(listStoreRepositoryStub);

  return {
    sut,
    listStoreRepositoryStub,
  };
};

describe('DbListStore usecase', () => {
  test('Should call StoreMongoRepository', async () => {
    const { sut, listStoreRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(listStoreRepositoryStub, 'getAll');
    await sut.getAll();
    expect(addSpy).toBeCalledWith();
  });

  test('Should throws if StoreMongoRepository throws', async () => {
    const { sut, listStoreRepositoryStub } = makeSut();
    jest
      .spyOn(listStoreRepositoryStub, 'getAll')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.getAll();
    expect(promise).rejects.toThrow();
  });

  test('Should return Store array on success', async () => {
    const { sut } = makeSut();

    const response = await sut.getAll();
    expect(response).toEqual([makeFakeStore()]);
  });
});
