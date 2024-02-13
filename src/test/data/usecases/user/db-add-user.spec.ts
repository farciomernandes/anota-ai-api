import { IHasher } from '@/data/protocols/cryptography/hasher';
import { DbAddUser } from '@/data/usecases/user/db-add-user';
import { UserModel } from '@/domain/models/user';
import { BcryptAdapter } from '@/infra/adapters/bcrypt-adapter';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';
import { BadRequestException } from '@nestjs/common';

const makeUserMongoRepository = (): UserMongoRepository => {
  class UserRepositoryStub implements UserMongoRepository {
    findByEmail(email: string): Promise<boolean> {
      return Promise.resolve(false);
    }
    async create(payload: AddUserModel): Promise<UserModel> {
      return Promise.resolve({} as UserModel);
    }
  }

  return new UserRepositoryStub();
};

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
  const fakeRequest = {
    name: 'John Doe',
    email: 'any_email@mail.com',
    password: 'any_password',
  };
  test('Should call UserMongoRepository with correct values', async () => {
    const { sut, addUserRepositoryStub, hasher } = makeSut();

    jest
      .spyOn(hasher, 'hash')
      .mockReturnValueOnce(Promise.resolve('hashed_password'));

    const repositorySpy = jest.spyOn(addUserRepositoryStub, 'create');
    await sut.create(fakeRequest);
    expect(repositorySpy).toHaveBeenCalledWith({
      ...fakeRequest,
      password: 'hashed_password',
    });
  });

  test('Should throw BadRequestException if email already exists!', async () => {
    const { sut, addUserRepositoryStub } = makeSut();

    jest
      .spyOn(addUserRepositoryStub, 'findByEmail')
      .mockResolvedValueOnce(Promise.resolve(true));

    const promise = sut.create(fakeRequest);
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should call Hasher with correct value', async () => {
    const { sut, hasher } = makeSut();

    const hasherSpy = jest.spyOn(hasher, 'hash');
    await sut.create(fakeRequest);
    expect(hasherSpy).toHaveBeenCalledWith(fakeRequest.password);
  });

  test('Should returns throw if usecase throws', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'create')
      .mockResolvedValueOnce(Promise.reject(new Error()));

    const promise = sut.create(fakeRequest);
    await expect(promise).rejects.toThrow();
  });
});
