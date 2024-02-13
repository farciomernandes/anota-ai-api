import { IHasher } from '@/data/protocols/cryptography/hasher';
import { DbAddUser } from '@/data/usecases/user/db-add-user';
import { BcryptAdapter } from '@/infra/adapters/bcrypt-adapter';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import {
  makeFakeRequest,
  makeUserMongoRepository,
} from '@/test/mock/db-mock-helper-user';
import { BadRequestException } from '@nestjs/common';

type SutTypes = {
  sut: DbAddUser;
  addUserRepositoryStub: UserMongoRepository;
  hasher: IHasher;
};

const makeSut = (): SutTypes => {
  const addUserRepositoryStub = makeUserMongoRepository();
  const hasher = new BcryptAdapter();

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
    await sut.create(makeFakeRequest());
    expect(repositorySpy).toHaveBeenCalledWith({
      ...makeFakeRequest(),
      password: 'hashed_password',
    });
  });

  test('Should throw BadRequestException if email already exists!', async () => {
    const { sut, addUserRepositoryStub } = makeSut();

    jest
      .spyOn(addUserRepositoryStub, 'findByEmail')
      .mockResolvedValueOnce(Promise.resolve(true));

    const promise = sut.create(makeFakeRequest());
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should call Hasher with correct value', async () => {
    const { sut, hasher } = makeSut();

    const hasherSpy = jest.spyOn(hasher, 'hash');
    await sut.create(makeFakeRequest());
    expect(hasherSpy).toHaveBeenCalledWith(makeFakeRequest().password);
  });

  test('Should returns throw if usecase throws', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'create')
      .mockResolvedValueOnce(Promise.reject(new Error()));

    const promise = sut.create(makeFakeRequest());
    await expect(promise).rejects.toThrow();
  });
});
