import { BadRequestException } from '@nestjs/common';
import { DbAddCategory } from '@/core/application/category/db-add-category';

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import {
  makeCategoryRepository,
  makeFakeCategory,
} from '@/test/mock/db-mock-helper-category';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';

type SutTypes = {
  sut: DbAddCategory;
  addCategoryRepositoryStub: CategoryRepository;
};

const makeSut = (): SutTypes => {
  const addCategoryRepositoryStub = makeCategoryRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);
  const sut = new DbAddCategory(addCategoryRepositoryStub, snsProxyStub);

  return {
    sut,
    addCategoryRepositoryStub,
  };
};

describe('DbAddCategory usecase', () => {
  const fakeRequestData = {
    title: `any_title`,
    description: 'any_description',
    ownerId: 'any_ownerId',
  };

  let categoryCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    categoryCollection = await MongoHelper.getCollection('categories');
    await categoryCollection.deleteMany({});
  });

  test('Should call CategoryMongoRepository with correct values', async () => {
    const { sut, addCategoryRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addCategoryRepositoryStub, 'create');
    await sut.create(fakeRequestData);
    expect(addSpy).toBeCalledWith(fakeRequestData);
  });

  test('Should return BadRequestException if try create category if already exist title', async () => {
    const { sut, addCategoryRepositoryStub } = makeSut();
    jest
      .spyOn(addCategoryRepositoryStub, 'findByTitle')
      .mockReturnValueOnce(Promise.resolve(true));
    const promise = sut.create(fakeRequestData);
    await expect(promise).rejects.toThrowError(BadRequestException);
  });

  test('Should return category on success', async () => {
    const { sut } = makeSut();
    const response = await sut.create(fakeRequestData);
    expect(response).toEqual(makeFakeCategory());
  });
});
