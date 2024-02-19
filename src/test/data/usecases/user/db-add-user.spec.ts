import { IHasher } from '@/data/protocols/cryptography/hasher';
import { DbAddUser } from '@/data/usecases/user/db-add-user';
import { BcryptAdapter } from '@/infra/adapters/bcrypt-adapter';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import {
  makeUserFakeRequest,
  makeUserMongoRepository,
  makeFakeUser,
} from '@/test/mock/db-mock-helper-user';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type SutTypes = {
  sut: DbAddUser;
  addUserRepositoryStub: UserMongoRepository;
  hasher: IHasher;
};

const makeSut = (): SutTypes => {
  const addUserRepositoryStub = makeUserMongoRepository();
  const hasher = new BcryptAdapter(new ConfigService());

  const sut = new DbAddUser(addUserRepositoryStub, hasher);

  return {
    sut,
    addUserRepositoryStub,
    hasher,
  };
};

describe('DbAddUser usecase', () => {
  test('Should call UserMongoRepository with correct values', async () => {
    const { sut, addUserRepositoryStub, hasher } = makeSut();

    jest
      .spyOn(hasher, 'hash')
      .mockReturnValueOnce(Promise.resolve('hashed_password'));

    const repositorySpy = jest.spyOn(addUserRepositoryStub, 'create');
    await sut.create(makeUserFakeRequest());
    expect(repositorySpy).toHaveBeenCalledWith({
      ...makeUserFakeRequest(),
      password: 'hashed_password',
    });
  });

  test('Should throw BadRequestException if email already exists!', async () => {
    const { sut, addUserRepositoryStub } = makeSut();

    jest
      .spyOn(addUserRepositoryStub, 'findByEmail')
      .mockResolvedValueOnce(Promise.resolve(makeFakeUser()));

    const promise = sut.create(makeUserFakeRequest());
    await expect(promise).rejects.toThrow(BadRequestException);
    await expect(promise).rejects.toThrowError(
      `Already exists a user with ${makeUserFakeRequest().email} email.`,
    );
  });

  test('Should returns throw if usecase throws', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'create')
      .mockResolvedValueOnce(Promise.reject(new Error()));

    const promise = sut.create(makeUserFakeRequest());
    await expect(promise).rejects.toThrow();
  });
});
