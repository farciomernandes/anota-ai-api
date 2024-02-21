import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';

import { DbDeleteProduct } from '@/core/application/product/db-delete-product';
import { ConfigService } from '@nestjs/config';
import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import {
  makeFakeProduct,
  makeProductMongoRepository,
} from '@/test/mock/db-mock-helper-product';

type SutTypes = {
  sut: DbDeleteProduct;
  deleteProductRepositoryStub: ProductMongoRepository;
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
  test('Should call ProductMongoRepository with correct values', async () => {
    const { sut, deleteProductRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteProductRepositoryStub, 'delete');
    await sut.delete(makeFakeProduct().id);
    expect(deleteSpy).toBeCalledWith(makeFakeProduct().id);
  });
});
