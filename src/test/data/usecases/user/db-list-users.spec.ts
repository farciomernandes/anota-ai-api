import { DbListUser } from '@/data/usecases/user/db-list-user';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import {
  makeFakeUser,
  makeUserMongoRepository,
} from '@/test/mock/db-mock-helper-user';

type SutTypes = {
  sut: DbListUser;
  listUserRepositoryStub: UserMongoRepository;
};

const makeSut = (): SutTypes => {
  const listUserRepositoryStub = makeUserMongoRepository();
  const sut = new DbListUser(listUserRepositoryStub);

  return {
    sut,
    listUserRepositoryStub,
  };
};

describe('DbListUser usecase', () => {
  test('Should call UserMongoRepository', async () => {
    const { sut, listUserRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(listUserRepositoryStub, 'getAll');
    await sut.getAll();
    expect(addSpy).toBeCalledWith();
  });

  test('Should throws if UserMongoRepository throws', async () => {
    const { sut, listUserRepositoryStub } = makeSut();
    jest
      .spyOn(listUserRepositoryStub, 'getAll')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.getAll();
    expect(promise).rejects.toThrow();
  });

  test('Should return User array on success', async () => {
    const { sut } = makeSut();

    const response = await sut.getAll();
    expect(response).toEqual([makeFakeUser()]);
  });
});
