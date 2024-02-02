import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';
import { DbAddProduct } from './db-add-product';
import {
  makeFakeProduct,
  makeProductMongoRepository,
} from './db-mock-helper-product';
import { AddProductModel } from '../../../presentation/dtos/product/add-product.dto';
import { BadRequestException } from '@nestjs/common';
import { makeCategoryMongoRepository } from '../category/db-mock-helper-category';
import { CategoryMongoRepository } from '../../../infra/db/mongodb/category/category-mongo-repository';
import { ConfigService } from '@nestjs/config';
import { ProxySendMessage } from '../../../data/protocols/sns/send-message';
import { makeSnsProxyMock } from '../../../infra/proxy/sns-proxy-mock-helper';

interface SutTypes {
  sut: DbAddProduct;
  addProductRepositoryStub: ProductMongoRepository;
  categoryRepositoryStub: CategoryMongoRepository;
  snsProxyStub: ProxySendMessage;
}

const makeSut = (): SutTypes => {
  const addProductRepositoryStub = makeProductMongoRepository();
  const categoryRepositoryStub = makeCategoryMongoRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);
  const sut = new DbAddProduct(
    addProductRepositoryStub,
    categoryRepositoryStub,
    snsProxyStub,
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
    title: 'any_title',
    description: 'any_description',
    ownerId: 'any_ownerId',
    price: 10,
    categoryId: 'category_id',
  };

  test('Should call ProductMongoRepository with correct values', async () => {
    const { sut, addProductRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addProductRepositoryStub, 'create');
    await sut.create(fakeRequestData);
    expect(addSpy).toBeCalledWith(fakeRequestData);
  });

  test('Should throws if ProductMongoRepository throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(sut, 'create').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.create(fakeRequestData);
    await expect(promise).rejects.toThrow();
  });

  test('Should return Product on success', async () => {
    const { sut } = makeSut();

    const response = await sut.create(fakeRequestData);
    expect(response).toEqual(makeFakeProduct());
  });

  test('Should return BadRequestException if try create category if already exist title', async () => {
    const { sut, addProductRepositoryStub } = makeSut();
    jest
      .spyOn(addProductRepositoryStub, 'findByTitle')
      .mockReturnValueOnce(Promise.resolve(true));
    const promise = sut.create(fakeRequestData);
    await expect(promise).rejects.toThrowError(BadRequestException);
  });

  test('Should return BadRequestException if categoryId does not exist', async () => {
    const { sut, categoryRepositoryStub } = makeSut();
    jest.mock('../../../infra/db/mongodb/category/category-mongo-repository');

    jest
      .spyOn(categoryRepositoryStub, 'findById')
      .mockImplementationOnce(() => null);

    const promise = sut.create(fakeRequestData);
    await expect(promise).rejects.toThrowError(BadRequestException);
  });
});
