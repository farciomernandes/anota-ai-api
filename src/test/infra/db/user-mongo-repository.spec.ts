import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import { makeFakeUser } from '@/test/mock/db-mock-helper-user';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

type SutTypes = {
  sut: UserMongoRepository;
};

const makeSut = (): SutTypes => {
  const sut = new UserMongoRepository();

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

    await sut.create(makeFakeUser());

    const count = await userCollection.countDocuments();
    expect(count).toBe(1);
  });

  test('Should return InternalServerErrorException if create throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const promise = sut.create(makeFakeUser());
    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should list users on success', async () => {
    const { sut } = makeSut();

    const fakeUser1 = {
      email: makeFakeUser().email,
      name: makeFakeUser().name,
      password: makeFakeUser().password,
      categories: [],
      products: [],
    };

    const fakeUser2 = {
      email: makeFakeUser().email,
      name: makeFakeUser().name,
      password: makeFakeUser().password,
      categories: [],
      products: [],
    };

    await userCollection.insertMany([fakeUser1, fakeUser2]);

    const response = await sut.getAll();

    const expectedOutput = [
      MongoHelper.map(fakeUser1),
      MongoHelper.map(fakeUser2),
    ];

    expect(response).toEqual(expectedOutput);
  });

  test('Should return InternalServerErrorException if list users throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });
    const promise = sut.getAll();

    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should return user if findByEmail finds user', async () => {
    const { sut } = makeSut();
    const fakeUser = makeFakeUser();

    jest.spyOn(sut, 'findByEmail').mockResolvedValueOnce(makeFakeUser());

    const response = await sut.findByEmail(fakeUser.email);

    expect(response.id).toBe(fakeUser.id);
  });

  test('Should return NotFoundException if findByEmail not matching!', async () => {
    const { sut } = makeSut();

    const promise = sut.findByEmail('nonexistent@mail.com');
    await expect(promise).rejects.toThrowError(NotFoundException);
  });

  test('Should return InternalServerErrorException if findByEmail throws!', async () => {
    const { sut } = makeSut();

    await sut.create(makeFakeUser());

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const promise = sut.findByEmail(makeFakeUser().email);
    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });
});
