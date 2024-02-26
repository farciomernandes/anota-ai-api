import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';

import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  makeFakeAdmin,
  makeAdminFakeRequest,
} from '@/test/mock/db-mock-helper-admin';

import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';
import { AdminMongoRepository } from '@/infra/db/mongodb/admin/admin-mongo-repository';

type SutTypes = {
  sut: AdminMongoRepository;
};

const makeSut = (): SutTypes => {
  const sut = new AdminMongoRepository();

  return {
    sut,
  };
};

describe('Admin Mongo Repository', () => {
  let adminCollection: Collection;
  let roleCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    adminCollection = await MongoHelper.getCollection('admins');
    roleCollection = await MongoHelper.getCollection('roles');

    await adminCollection.deleteMany({});
    await roleCollection.deleteMany({});
  });

  test('Should create Admin on success', async () => {
    const { sut } = makeSut();

    const role = await roleCollection.insertOne({
      ...makeFakeRoles(),
    });

    await sut.create({
      ...makeAdminFakeRequest(),
      roleId: role.insertedId.toString(),
    });

    const count = await adminCollection.countDocuments();
    expect(count).toBe(1);
  });
  test('Should return InternalServerErrorException if create throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const promise = sut.create(makeAdminFakeRequest());
    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should return NotFoundException if role not matching in create', async () => {
    const { sut } = makeSut();

    await roleCollection.insertOne({
      ...makeFakeRoles(),
    });

    const promise = sut.create({
      ...makeAdminFakeRequest(),
    });

    await expect(promise).rejects.toThrowError(NotFoundException);
  });

  test('Should list Admins on success', async () => {
    const { sut } = makeSut();

    const fakeAdmin1 = {
      email: makeFakeAdmin().email,
      name: makeFakeAdmin().name,
      password: makeFakeAdmin().password,
    };

    const fakeAdmin2 = {
      email: makeFakeAdmin().email,
      name: makeFakeAdmin().name,
      password: makeFakeAdmin().password,
    };

    await adminCollection.insertMany([fakeAdmin1, fakeAdmin2]);

    const response = await sut.getAll();

    const expectedOutput = [
      MongoHelper.map(fakeAdmin1),
      MongoHelper.map(fakeAdmin2),
    ];

    expect(response).toEqual(expectedOutput);
  });

  test('Should return InternalServerErrorException if list Admins throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });
    const promise = sut.getAll();

    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should return Admin if findByEmail finds Admin', async () => {
    const { sut } = makeSut();
    const fakeAdmin = makeFakeAdmin();

    jest.spyOn(sut, 'findByEmail').mockResolvedValueOnce(makeFakeAdmin());

    const response = await sut.findByEmail(fakeAdmin.email);

    expect(response.id).toBe(fakeAdmin.id);
  });

  test('Should return null if findByEmail not matching', async () => {
    const { sut } = makeSut();

    const response = await sut.findByEmail('nonexistent@mail.com');
    expect(response).toBe(null);
  });

  test('Should return InternalServerErrorException if findByEmail throws', async () => {
    const { sut } = makeSut();

    await sut.findByEmail(makeAdminFakeRequest().email);

    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const promise = sut.findByEmail(makeFakeAdmin().email);
    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should return correct if findById searched store on success', async () => {
    const { sut } = makeSut();

    const admin = await adminCollection.insertOne(makeFakeAdmin());
    const response = await sut.findById(admin.insertedId.toHexString());
    expect(response.email).toEqual(makeFakeAdmin().email);
    expect(response.name).toEqual(makeFakeAdmin().name);
  });

  test('Should return NotFoundException if search id in findById', async () => {
    const { sut } = makeSut();
    const notFoundId = '65bd52691a0f4c3b57819a4b';
    await adminCollection.insertOne(makeFakeAdmin());

    const promise = sut.findById(notFoundId);

    await expect(promise).rejects.toThrowError(NotFoundException);
  });

  test('Should delete admin on success', async () => {
    const { sut } = makeSut();
    const admin = await adminCollection.insertOne(makeFakeAdmin());
    const response = await sut.delete(String(admin.insertedId));

    expect(response.email).toEqual(makeFakeAdmin().email);
    expect(response.name).toEqual(makeFakeAdmin().name);
    expect(response.id).toEqual(admin.insertedId);
  });

  test('Should return BadRequestException throws in delete if send invalid_id', async () => {
    const { sut } = makeSut();

    const response = sut.delete('invalid_id');
    await expect(response).rejects.toThrow(BadRequestException);
  });

  test('Should return InternalServerErrorException throws in delete if send invalid_id', async () => {
    const { sut } = makeSut();
    const notFoundId = '65d771c9a1acf6d4b2aec923';

    const response = sut.delete(notFoundId);
    await expect(response).rejects.toThrow(InternalServerErrorException);
  });
});
