import {
  makeStoreMongoRepository,
  makeFakeStore,
} from '@/test/mock/db-mock-helper-store';
import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { DbDeleteStore } from '@/core/application/store/db-delete-store';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';

type SutTypes = {
  sut: DbDeleteStore;
  deleteStoreRepositoryStub: StoreMongoRepository;
};

const makeSut = (): SutTypes => {
  const deleteStoreRepositoryStub = makeStoreMongoRepository();
  const sut = new DbDeleteStore(deleteStoreRepositoryStub);

  return {
    sut,
    deleteStoreRepositoryStub,
  };
};
describe('DbDeleteStore usecase', () => {
  test('Should call Delete on StoreMongoRepository with correct values', async () => {
    const { sut, deleteStoreRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteStoreRepositoryStub, 'delete');
    await sut.delete(makeFakeStore().id, {
      id: makeFakeStore().id,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });
    expect(deleteSpy).toBeCalledWith(makeFakeStore().id);
  });

  test('Should call findById StoreMongoRepository with correct value', async () => {
    const { sut, deleteStoreRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(deleteStoreRepositoryStub, 'findById');
    await sut.delete(makeFakeStore().id, {
      id: makeFakeStore().id,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });
    expect(findSpy).toBeCalledWith(makeFakeStore().id);
  });

  test('Shoul call delete StoreMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, deleteStoreRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteStoreRepositoryStub, 'delete');
    await sut.delete(makeFakeStore().id, {
      id: 'admin-id',
      roles: makeFakeRoles(),
    });

    expect(deleteSpy).toHaveBeenCalledWith(makeFakeStore().id);
  });
});
