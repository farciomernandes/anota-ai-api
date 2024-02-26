import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';

import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import {
  makeFakeStore,
  makeRequestAddStore,
} from '@/test/mock/db-mock-helper-store';

import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';

type SutTypes = {
  sut: StoreMongoRepository;
};

const makeSut = (): SutTypes => {
  const sut = new StoreMongoRepository();

  return {
    sut,
  };
};

describe('Store Mongo Repository', () => {
  let storeCollection: Collection;
  let roleCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    storeCollection = await MongoHelper.getCollection('stores');
    roleCollection = await MongoHelper.getCollection('roles');

    await storeCollection.deleteMany({});
    await roleCollection.deleteMany({});
  });

  test('Should create Store on success', async () => {
    const { sut } = makeSut();

    const role = await roleCollection.insertOne({
      ...makeFakeRoles(),
    });

    await sut.create({
      ...makeRequestAddStore(),
      roleId: role.insertedId.toString(),
    });

    const count = await storeCollection.countDocuments();
    expect(count).toBe(1);
  });

  test('Should return InternalServerErrorException if create throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const promise = sut.create(makeRequestAddStore());
    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should return NotFoundException if role not matching in create', async () => {
    const { sut } = makeSut();

    await roleCollection.insertOne({
      ...makeFakeRoles(),
    });

    const promise = sut.create({
      ...makeRequestAddStore(),
      roleId: makeRequestAddStore().roleId,
    });

    await expect(promise).rejects.toThrowError(NotFoundException);
  });

  test('Should list Stores on success', async () => {
    const { sut } = makeSut();

    const fakeStore1 = {
      email: makeFakeStore().email,
      name: makeFakeStore().name,
      password: makeFakeStore().password,
      categories: [],
      products: [],
      roles: [],
    };

    const fakeStore2 = {
      email: makeFakeStore().email,
      name: makeFakeStore().name,
      password: makeFakeStore().password,
      categories: [],
      products: [],
      roles: [],
    };

    await storeCollection.insertMany([fakeStore1, fakeStore2]);

    const response = await sut.getAll();

    const expectedOutput = [
      MongoHelper.map(fakeStore1),
      MongoHelper.map(fakeStore2),
    ];

    expect(response).toEqual(expectedOutput);
  });

  test('Should return InternalServerErrorException if list Stores throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });
    const promise = sut.getAll();

    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should return Store if findByEmail finds Store', async () => {
    const { sut } = makeSut();
    const fakeStore = makeFakeStore();

    jest.spyOn(sut, 'findByEmail').mockResolvedValueOnce(makeFakeStore());

    const response = await sut.findByEmail(fakeStore.email);

    expect(response.id).toBe(fakeStore.id);
  });

  test('Should return null if findByEmail not matching', async () => {
    const { sut } = makeSut();

    const response = await sut.findByEmail('nonexistent@mail.com');
    expect(response).toBe(null);
  });

  test('Should return InternalServerErrorException if findByEmail throws', async () => {
    const { sut } = makeSut();

    await sut.findByEmail(makeRequestAddStore().email);

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const promise = sut.findByEmail(makeFakeStore().email);
    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should return correct if findById searched store on success', async () => {
    const { sut } = makeSut();

    const store = await storeCollection.insertOne(makeFakeStore());
    const response = await sut.findById(store.insertedId.toHexString());
    expect(response.email).toEqual(makeFakeStore().email);
    expect(response.name).toEqual(makeFakeStore().name);
  });

  test('Should return NotFoundException if search id in findById', async () => {
    const { sut } = makeSut();
    const notFoundId = '65bd52691a0f4c3b57819a4b';
    await storeCollection.insertOne(makeFakeStore());

    const promise = sut.findById(notFoundId);

    await expect(promise).rejects.toThrowError(NotFoundException);
  });

  test('Should delete Store on success', async () => {
    const { sut } = makeSut();
    const store = await storeCollection.insertOne(makeFakeStore());
    const response = await sut.delete(String(store.insertedId));

    expect(response.email).toEqual(makeFakeStore().email);
    expect(response.name).toEqual(makeFakeStore().name);
    expect(response.id).toEqual(store.insertedId);
  });

  test('Should return BadRequestException throws in delete if send invalid_id', async () => {
    const { sut } = makeSut();

    const response = sut.delete('invalid_id');
    await expect(response).rejects.toThrow(BadRequestException);
  });

  test('Should return BadRequestException throws in delete if send invalid_id', async () => {
    const { sut } = makeSut();

    const response = sut.delete('invalid_id');
    await expect(response).rejects.toThrow(BadRequestException);
  });
});
