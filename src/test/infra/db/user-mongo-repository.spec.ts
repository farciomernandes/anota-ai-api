import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Collection } from 'mongodb';
import { makeFakeCategory } from '@/test/mock/db-mock-helper-category';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import {
  makeFakeUser,
  makeUserFakeRequest,
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
    await userCollection.deleteMany({});
  });

  test('Should create user on success', async () => {
    const { sut } = makeSut();

    const fakeUser = makeFakeUser();
    const response = await sut.create(fakeUser);
    console.log('response  ', response);
    console.log('fakeUser  ', fakeUser);

    expect(response.email).toEqual(fakeUser.email);
  });

  test('Should return BadRequestException if send category_id invalid', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'create')
      .mockReturnValueOnce(Promise.reject(new BadRequestException()));

    const promise = sut.create(makeUserFakeRequest());

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should list users on success', async () => {
    const { sut } = makeSut();

    const fakeUser = makeFakeUser();

    await userCollection.insertMany([fakeUser]);

    const response = await sut.getAll();

    expect(response[0].email).toEqual(fakeUser.email);
  });

  test('Should return false if findByEmail not find user', async () => {
    const { sut } = makeSut();
    const findSpy = jest.spyOn(sut, 'findByEmail');
    const response = await sut.findByEmail(makeFakeUser().email);

    expect(findSpy).toHaveBeenLastCalledWith(makeFakeUser().email);
    expect(response).toBe(false);
  });
});
