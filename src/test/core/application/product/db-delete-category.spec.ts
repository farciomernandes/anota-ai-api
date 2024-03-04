import { DbDeleteProduct } from '@/core/application/product/db-delete-product';
import { ConfigService } from '@nestjs/config';
import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import {
  makeFakeProduct,
  makeFakeProductAuthenticatedAdmin,
  makeFakeProductAuthenticatedStore,
  makeProductMongoRepository,
} from '@/test/mock/db-mock-helper-product';
import { UnauthorizedException } from '@nestjs/common';
import { ProductRepository } from '@/core/domain/repositories/product-repository';

type SutTypes = {
  sut: DbDeleteProduct;
  deleteProductRepositoryStub: ProductRepository;
};

const makeSut = (): SutTypes => {
  const deleteProductRepositoryStub = makeProductMongoRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);

  const sut = new DbDeleteProduct(deleteProductRepositoryStub, snsProxyStub);

  return {
    sut,
    deleteProductRepositoryStub,
  };
};
describe('DbDeleteProduct usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should call ProductMongoRepository with correct values', async () => {
    const { sut, deleteProductRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteProductRepositoryStub, 'delete');
    await sut.delete(makeFakeProduct().id, makeFakeProductAuthenticatedAdmin());
    expect(deleteSpy).toBeCalledWith(
      makeFakeProduct().id,
      makeFakeProductAuthenticatedAdmin(),
    );
  });

  test('Shoul call delete ProductMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, deleteProductRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteProductRepositoryStub, 'delete');
    await sut.delete(makeFakeProduct().id, makeFakeProductAuthenticatedAdmin());

    expect(deleteSpy).toHaveBeenCalledWith(
      makeFakeProduct().id,
      makeFakeProductAuthenticatedAdmin(),
    );
  });

  test('Should throw UnauthorizedException if product ownerId not matching if userId sended', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'delete')
      .mockImplementationOnce(() =>
        Promise.reject(new UnauthorizedException()),
      );

    const promise = sut.delete(
      makeFakeProduct().id,
      makeFakeProductAuthenticatedStore(),
    );

    await expect(promise).rejects.toThrowError(UnauthorizedException);
  });
});
