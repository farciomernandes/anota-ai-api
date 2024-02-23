import { DbAddAdmin } from '@/core/application/admin/db-add-admin';
import { IHasher } from '@/core/domain/protocols/cryptography/hasher';
import { BcryptAdapter } from '@/infra/adapters/bcrypt-adapter';
import { AdminMongoRepository } from '@/infra/db/mongodb/admin/admin-mongo-repository';
import {
  makeFakeAdmin,
  makeAdminFakeRequest,
  makeAdminMongoRepository,
} from '@/test/mock/db-mock-helper-admin';

import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type SutTypes = {
  sut: DbAddAdmin;
  addAdminRepositoryStub: AdminMongoRepository;
  hasher: IHasher;
};

const makeSut = (): SutTypes => {
  const addAdminRepositoryStub = makeAdminMongoRepository();
  const hasher = new BcryptAdapter(new ConfigService());

  const sut = new DbAddAdmin(addAdminRepositoryStub, hasher);

  return {
    sut,
    addAdminRepositoryStub,
    hasher,
  };
};

describe('DbAddAdmin usecase', () => {
  test('Should call create and hasher with correct values', async () => {
    const { sut, addAdminRepositoryStub, hasher } = makeSut();

    const hashSpy = jest
      .spyOn(hasher, 'hash')
      .mockReturnValueOnce(Promise.resolve('hashed_password'));

    const repositorySpy = jest.spyOn(addAdminRepositoryStub, 'create');
    await sut.create(makeAdminFakeRequest());

    expect(hashSpy).toHaveBeenCalledWith(makeAdminFakeRequest().password);

    expect(repositorySpy).toHaveBeenCalledWith({
      ...makeAdminFakeRequest(),
      password: 'hashed_password',
      roleId: expect.any(String),
    });
  });

  test('Should throw BadRequestException if email already exists!', async () => {
    const { sut, addAdminRepositoryStub } = makeSut();

    jest
      .spyOn(addAdminRepositoryStub, 'findByEmail')
      .mockResolvedValueOnce(Promise.resolve(makeFakeAdmin()));

    const promise = sut.create(makeAdminFakeRequest());
    await expect(promise).rejects.toThrow(BadRequestException);
    await expect(promise).rejects.toThrowError(
      `Already exists a Admin with ${makeAdminFakeRequest().email} email.`,
    );
  });

  test('Should returns throw if usecase throws', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'create')
      .mockResolvedValueOnce(Promise.reject(new Error()));

    const promise = sut.create(makeAdminFakeRequest());
    await expect(promise).rejects.toThrow();
  });
});
