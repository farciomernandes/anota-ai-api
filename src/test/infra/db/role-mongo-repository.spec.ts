import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';

import { InternalServerErrorException } from '@nestjs/common';
import { RoleMongoRepository } from '@/infra/db/mongodb/role/role-mongo-repository';
import {
  makeFakeRoles,
  makeRequestAddRole,
} from '../../mock/db-mock-helper-role';

type SutTypes = {
  sut: RoleMongoRepository;
};

const makeSut = (): SutTypes => {
  const sut = new RoleMongoRepository();

  return {
    sut,
  };
};

describe('Role Mongo Repository', () => {
  let roleCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    roleCollection = await MongoHelper.getCollection('roles');
    await roleCollection.deleteMany({});
  });

  test('Should create Role on success', async () => {
    const { sut } = makeSut();

    await sut.create(makeRequestAddRole());

    const count = await roleCollection.countDocuments();
    expect(count).toBe(1);
  });

  test('Should return InternalServerErrorException if create throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const promise = sut.create(makeRequestAddRole());
    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should list Roles on success', async () => {
    const { sut } = makeSut();

    const fakeRole1 = {
      label: makeFakeRoles().label,
      value: makeFakeRoles().value,
    };

    const fakeRole2 = {
      label: makeFakeRoles().label,
      value: makeFakeRoles().value,
    };

    await roleCollection.insertMany([fakeRole1, fakeRole2]);

    const response = await sut.getAll();

    const expectedOutput = [
      MongoHelper.map(fakeRole1),
      MongoHelper.map(fakeRole2),
    ];

    expect(response).toEqual(expectedOutput);
  });

  test('Should return InternalServerErrorException if list Roles throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });
    const promise = sut.getAll();

    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should return Role if findByValue finds Role', async () => {
    const { sut } = makeSut();
    const fakeRole = makeFakeRoles();

    jest.spyOn(sut, 'findByValue').mockResolvedValueOnce(makeFakeRoles());

    const response = await sut.findByValue(fakeRole.value);

    expect(response.id).toBe(fakeRole.id);
  });

  test('Should return null if findByValue not matching', async () => {
    const { sut } = makeSut();

    const response = await sut.findByValue('invalid_value');
    expect(response).toBe(null);
  });

  test('Should return InternalServerErrorException if findByValue throws', async () => {
    const { sut } = makeSut();

    await sut.findByValue(makeRequestAddRole().value);

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const promise = sut.findByValue(makeFakeRoles().value);
    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });
});
