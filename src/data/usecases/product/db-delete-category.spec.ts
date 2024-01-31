import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';
import {
  makeProductMongoRepository,
  makeFakeProduct,
} from '../product/db-mock-helper-product';
import { DbDeleteProduct } from './db-delete-product';

interface SutTypes {
  sut: DbDeleteProduct;
  deleteProductRepositoryStub: ProductMongoRepository;
}

const makeSut = (): SutTypes => {
  const deleteProductRepositoryStub = makeProductMongoRepository();
  const sut = new DbDeleteProduct(deleteProductRepositoryStub);

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
