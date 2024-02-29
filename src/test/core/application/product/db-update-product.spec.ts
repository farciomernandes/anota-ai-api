import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import { DbUpdateProduct } from '@/core/application/product/db-update-product';
import { ConfigService } from '@nestjs/config';
import {
  makeFakeProduct,
  makeFakeProductAuthenticatedAdmin,
  makeFakeProductAuthenticatedStore,
  makeProductRepository,
} from '@/test/mock/db-mock-helper-product';
import { ProxySendMessage } from '@/core/domain/protocols/aws/sns-send-message';
import { UnauthorizedException } from '@nestjs/common';
import { ProductRepository } from '@/core/domain/repositories/product-repository';

type SutTypes = {
  sut: DbUpdateProduct;
  updateProductRepositoryStub: ProductRepository;
  snsProxyStub: ProxySendMessage;
};

const makeSut = (): SutTypes => {
  const updateProductRepositoryStub = makeProductRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);

  const sut = new DbUpdateProduct(updateProductRepositoryStub, snsProxyStub);

  return {
    sut,
    updateProductRepositoryStub,
    snsProxyStub,
  };
};

describe('DbUpdate Product', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Shoul call DbUpdateProduct with correct values', async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateProductRepositoryStub, 'update');
    await sut.update(
      'valid_id',
      makeFakeProduct(),
      makeFakeProductAuthenticatedAdmin(),
    );
    expect(updateSpy).toHaveBeenCalledWith(
      'valid_id',
      makeFakeProduct(),
      makeFakeProductAuthenticatedAdmin(),
    );
  });

  test('Shoul call update ProductMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateProductRepositoryStub, 'update');
    await sut.update(
      'valid_id',
      makeFakeProduct(),
      makeFakeProductAuthenticatedAdmin(),
    );
    expect(updateSpy).toHaveBeenCalledWith(
      'valid_id',
      makeFakeProduct(),
      makeFakeProductAuthenticatedAdmin(),
    );
  });

  test('Should throw UnauthorizedException if Product ownerId not matching if userId sended', async () => {
    const { sut } = makeSut();

    const promise = sut.update('any_id', makeFakeProduct(), {
      id: 'invalid_id',
      roles: makeFakeProductAuthenticatedStore().roles,
    });

    await expect(promise).rejects.toThrowError(UnauthorizedException);
  });

  test('Should throws if DbUpdateProduct throws', async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    jest
      .spyOn(updateProductRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.update(
      'any_id',
      makeFakeProduct(),
      makeFakeProductAuthenticatedStore(),
    );
    expect(promise).rejects.toThrow();
  });
});
