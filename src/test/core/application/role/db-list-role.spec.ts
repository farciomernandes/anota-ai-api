import { DbListRole } from '@/core/application/role/db-list-role';
import { RoleMongoRepository } from '@/infra/db/mongodb/role/role-mongo-repository';
import {
  makeFakeRoles,
  makeRoleMongoRepository,
} from '@/test/mock/db-mock-helper-role';

type SutTypes = {
  sut: DbListRole;
  listRoleRepositoryStub: RoleMongoRepository;
};

const makeSut = (): SutTypes => {
  const listRoleRepositoryStub = makeRoleMongoRepository();
  const sut = new DbListRole(listRoleRepositoryStub);

  return {
    sut,
    listRoleRepositoryStub,
  };
};

describe('DbListRole usecase', () => {
  test('Should call RoleMongoRepository', async () => {
    const { sut, listRoleRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(listRoleRepositoryStub, 'getAll');
    await sut.getAll();
    expect(addSpy).toBeCalledWith();
  });

  test('Should throws if RoleMongoRepository throws', async () => {
    const { sut, listRoleRepositoryStub } = makeSut();
    jest
      .spyOn(listRoleRepositoryStub, 'getAll')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.getAll();
    expect(promise).rejects.toThrow();
  });

  test('Should return Role array on success', async () => {
    const { sut } = makeSut();

    const response = await sut.getAll();
    expect(response).toEqual([makeFakeRoles()]);
  });
});
