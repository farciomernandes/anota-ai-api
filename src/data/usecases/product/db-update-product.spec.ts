import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';
import {
  makeProductMongoRepository,
  makeFakeProduct,
} from '../product/db-mock-helper-product';
import { DbUpdateProduct } from './db-update-product';

interface SutTypes {
  sut: DbUpdateProduct;
  updateProductRepositoryStub: ProductMongoRepository;
}

const makeSut = (): SutTypes => {
  const updateProductRepositoryStub = makeProductMongoRepository();
  const sut = new DbUpdateProduct(updateProductRepositoryStub);

  return {
    sut,
    updateProductRepositoryStub,
  };
};

describe('DbUpdate Product', () => {
  test('Shoul call DbUpdateProduct with correct values', async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateProductRepositoryStub, 'update');
    await sut.update('valid_id', makeFakeProduct());
    expect(updateSpy).toHaveBeenCalledWith('valid_id', makeFakeProduct());
  });

  test('Should throws if DbUpdateProduct throws', async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    jest
      .spyOn(updateProductRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.update('any_id', makeFakeProduct());
    expect(promise).rejects.toThrow();
  });
});
