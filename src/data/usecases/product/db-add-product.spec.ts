import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';
import { DbAddProduct } from './db-add-product';
import {
  makeFakeProduct,
  makeProductMongoRepository,
} from './db-mock-helper-product';
import { AddProductModel } from '../../../presentation/dtos/product/add-product.dto';

interface SutTypes {
  sut: DbAddProduct;
  addProductRepositoryStub: ProductMongoRepository;
}

const makeSut = (): SutTypes => {
  const addProductRepositoryStub = makeProductMongoRepository();
  const sut = new DbAddProduct(addProductRepositoryStub);

  return {
    sut,
    addProductRepositoryStub,
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
    const { sut, addProductRepositoryStub } = makeSut();
    jest
      .spyOn(addProductRepositoryStub, 'create')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.create(fakeRequestData);
    expect(promise).rejects.toThrow();
  });

  test('Should return Product on success', async () => {
    const { sut } = makeSut();

    const response = await sut.create(fakeRequestData);
    expect(response).toEqual(makeFakeProduct());
  });
});
