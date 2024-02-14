import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import {
  makeFakeUser,
  makeUserMongoRepository,
} from '@/test/mock/db-mock-helper-user';

type SutTypes = {
  sut: UserMongoRepository;
};
const makeSut = (): SutTypes => {
  const sut = makeUserMongoRepository();

  return {
    sut,
  };
};

describe('User Mongo Repository', () => {
  let userCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users');
  });

  test('Should create user on success', async () => {
    const { sut } = makeSut();

    const fakeUser = makeFakeUser();
    const response = await sut.create(fakeUser);

    expect(response.email).toEqual(fakeUser.email);
  });

  test('Should list users on success', async () => {
    const { sut } = makeSut();
    const fakeUser = makeFakeUser();

    const response = await sut.getAll();

    expect(response[0].email).toEqual(fakeUser.email);
  });

  test('Should return true if findByEmail finds user', async () => {
    const { sut } = makeSut();
    const fakeUser = makeFakeUser();

    jest.spyOn(sut, 'findByEmail').mockResolvedValueOnce(makeFakeUser());

    const response = await sut.findByEmail(fakeUser.email);

    expect(response.id).toBe(fakeUser.id);
  });

  test('Should return false if findByEmail not find user', async () => {
    const { sut } = makeSut();
    const findSpy = jest.spyOn(sut, 'findByEmail');
    const response = await sut.findByEmail('nonexistent@mail.com');
    console.log('response ', response);
    expect(findSpy).toHaveBeenLastCalledWith('nonexistent@mail.com');
    expect(response).toStrictEqual({});
  });

  test('Should return true if findByEmail finds user', async () => {
    const { sut } = makeSut();
    const fakeUser = makeFakeUser();

    jest.spyOn(sut, 'findByEmail').mockResolvedValueOnce(makeFakeUser());

    const response = await sut.findByEmail(fakeUser.email);

    expect(response.id).toBe(fakeUser.id);
  });
});
