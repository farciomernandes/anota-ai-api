import { DbAddRole } from '@/core/application/role/db-add-role';
import { RoleMongoRepository } from '@/infra/db/mongodb/role/role-mongo-repository';
import { BadRequestException } from '@nestjs/common';

import {
  makeFakeRoles,
  makeRequestAddRole,
  makeRoleMongoRepository,
} from '../../../mock/db-mock-helper-role';

type SutTypes = {
  sut: DbAddRole;
  addRoleRepositoryStub: RoleMongoRepository;
};

const makeSut = (): SutTypes => {
  const addRoleRepositoryStub = makeRoleMongoRepository();

  const sut = new DbAddRole(addRoleRepositoryStub);

  return {
    sut,
    addRoleRepositoryStub,
  };
};

describe('DbAddRole usecase', () => {
  test('Should call create with success', async () => {
    const { sut, addRoleRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(addRoleRepositoryStub, 'create');
    await sut.create(makeRequestAddRole());

    expect(repositorySpy).toHaveBeenCalledWith({
      ...makeRequestAddRole(),
    });
  });

  test('Should call findByValue with correct value', async () => {
    const { sut, addRoleRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(addRoleRepositoryStub, 'findByValue');
    await sut.create(makeRequestAddRole());

    expect(repositorySpy).toHaveBeenCalledWith(makeRequestAddRole().value);
  });

  test('Should throw BadRequestException if value already exists!', async () => {
    const { sut, addRoleRepositoryStub } = makeSut();

    jest
      .spyOn(addRoleRepositoryStub, 'findByValue')
      .mockResolvedValueOnce(Promise.resolve(makeFakeRoles()));

    const promise = sut.create(makeRequestAddRole());
    await expect(promise).rejects.toThrow(BadRequestException);
    await expect(promise).rejects.toThrowError(
      `Already exists a role with ${makeRequestAddRole().value} value.`,
    );
  });

  test('Should returns throw if usecase throws', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'create')
      .mockResolvedValueOnce(Promise.reject(new Error()));

    const promise = sut.create(makeRequestAddRole());
    await expect(promise).rejects.toThrow();
  });
});
