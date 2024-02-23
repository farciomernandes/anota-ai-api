import { DbListAdmin } from '@/core/application/admin/db-list-admin';
import { AdminMongoRepository } from '@/infra/db/mongodb/admin/admin-mongo-repository';
import {
  makeFakeAdmin,
  makeAdminMongoRepository,
} from '@/test/mock/db-mock-helper-admin';

type SutTypes = {
  sut: DbListAdmin;
  listAdminRepositoryStub: AdminMongoRepository;
};

const makeSut = (): SutTypes => {
  const listAdminRepositoryStub = makeAdminMongoRepository();
  const sut = new DbListAdmin(listAdminRepositoryStub);

  return {
    sut,
    listAdminRepositoryStub,
  };
};

describe('DbListAdmin usecase', () => {
  test('Should call AdminMongoRepository', async () => {
    const { sut, listAdminRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(listAdminRepositoryStub, 'getAll');
    await sut.getAll();
    expect(addSpy).toBeCalledWith();
  });

  test('Should throws if AdminMongoRepository throws', async () => {
    const { sut, listAdminRepositoryStub } = makeSut();
    jest
      .spyOn(listAdminRepositoryStub, 'getAll')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.getAll();
    expect(promise).rejects.toThrow();
  });

  test('Should return Admin array on success', async () => {
    const { sut } = makeSut();

    const response = await sut.getAll();
    expect(response).toEqual([makeFakeAdmin()]);
  });
});
