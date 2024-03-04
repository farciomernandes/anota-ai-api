import { DbAddProduct } from '@/core/application/product/db-add-product';

import { AddProductModel } from '@/presentation/dtos/product/add-product.dto';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import {
  makeFakeProduct,
  makeProductMongoRepository,
} from '@/test/mock/db-mock-helper-product';
import { makeCategoryRepository } from '@/test/mock/db-mock-helper-category';
import { makeFile, makeS3UploadImageMock } from '@/test/mock/s3-mock-helper';
import { ProxySendMessage } from '@/core/domain/protocols/aws/sns-send-message';
import { ProductRepository } from '@/core/domain/repositories/product-repository';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';

type SutTypes = {
  sut: DbAddProduct;
  addProductRepositoryStub: ProductRepository;
  categoryRepositoryStub: CategoryRepository;
  snsProxyStub: ProxySendMessage;
};

const makeSut = (): SutTypes => {
  const addProductRepositoryStub = makeProductMongoRepository();
  const categoryRepositoryStub = makeCategoryRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);
  const S3Stub = makeS3UploadImageMock();

  const sut = new DbAddProduct(
    addProductRepositoryStub,
    categoryRepositoryStub,
    snsProxyStub,
    S3Stub,
  );

  return {
    sut,
    addProductRepositoryStub,
    categoryRepositoryStub,
    snsProxyStub,
  };
};

describe('DbAddProduct usecase', () => {
  const fakeRequestData: AddProductModel = {
    title: 'new_title',
    description: 'any_description',
    ownerId: 'any_ownerId',
    price: 10,
    categoryId: 'category_id',
    file: 'https://fake-s3-url.com/fake-object',
  };

  test('Should call ProductMongoRepository with correct values', async () => {
    const { sut, addProductRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addProductRepositoryStub, 'create');
    await sut.create(fakeRequestData, makeFile());
    expect(addSpy).toBeCalledWith(fakeRequestData, expect.any(Object));
  });

  test('Should throws if ProductMongoRepository throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(sut, 'create').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.create(fakeRequestData, makeFile());
    await expect(promise).rejects.toThrow();
  });

  test('Should return Product on success', async () => {
    const { sut } = makeSut();

    const response = await sut.create(fakeRequestData, makeFile());
    expect(response).toEqual(makeFakeProduct());
  });

  test('Should return BadRequestException if try create category if already exist title', async () => {
    const { sut, addProductRepositoryStub } = makeSut();
    jest
      .spyOn(addProductRepositoryStub, 'findByTitle')
      .mockReturnValueOnce(Promise.resolve(true));
    const promise = sut.create(fakeRequestData, makeFile());
    await expect(promise).rejects.toThrowError(BadRequestException);
  });

  test('Should return BadRequestException if categoryId does not exist', async () => {
    const { sut, categoryRepositoryStub } = makeSut();
    jest.mock('@/infra/db/mongodb/category/category-mongo-repository');

    jest
      .spyOn(categoryRepositoryStub, 'findById')
      .mockImplementationOnce(() => null);

    const promise = sut.create(fakeRequestData, makeFile());
    await expect(promise).rejects.toThrowError(BadRequestException);
  });
});
