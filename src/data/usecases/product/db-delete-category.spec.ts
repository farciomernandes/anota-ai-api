import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';
import {
  makeProductMongoRepository,
  makeFakeProduct,
} from '@/domain/test/mock/db-mock-helper-product';
import { DbDeleteProduct } from './db-delete-product';
import { ConfigService } from '@nestjs/config';
import { makeSnsProxyMock } from '@/domain/test/mock/sns-proxy-mock-helper';

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
