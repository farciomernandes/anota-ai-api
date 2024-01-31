import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { ProductMongoRepository } from './product-mongo-repository';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { makeFakeProduct } from '../../../../data/usecases/product/db-mock-helper-product';
import { UpdateProductModel } from '../../../../presentation/dtos/product/update-product.dto';
interface SutTypes {
  sut: ProductMongoRepository;
}
const makeSut = (): SutTypes => {
  const sut = new ProductMongoRepository();

  return {
    sut,
  };
};

describe('Product Mongo Repository', () => {
  let productCollection: Collection;

  const fakeRequest = {
    categoryId: '65b55e87d161a296b867a4ce',
    description: 'any_description',
    ownerId: '65b55e87d161a296b867a4ce',
    price: 10,
    title: 'any_title',
  };

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    productCollection = await MongoHelper.getCollection('products');
    await productCollection.deleteMany({});
  });

  test('Should return BadequestException if send category_id invalid', async () => {
    const { sut } = makeSut();

    const promise = sut.create(fakeRequest);

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return InternalServerError throws if create throw InternalServerError', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut, 'create')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));
    const promise = sut.create(fakeRequest);
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should list products on success', async () => {
    const { sut } = makeSut();

    const fakeProduct1 = makeFakeProduct();
    const fakeProduct2 = makeFakeProduct();
    await productCollection.insertMany([fakeProduct1, fakeProduct2]);

    const response = await sut.getAll();

    const expectedOutput = [
      MongoHelper.map(fakeProduct1),
      MongoHelper.map(fakeProduct2),
    ];

    expect(response).toEqual(expectedOutput);
  });

  test('Should return InternalServerError throws if getAll throw InternalServerError', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut, 'getAll')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));
    const promise = sut.getAll();
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should update Product on success', async () => {
    const { sut } = makeSut();

    const fakeProduct = makeFakeProduct();
    const product = await productCollection.insertOne(fakeProduct);

    const updatedProduct: UpdateProductModel = {
      title: 'other_title',
      description: 'other_description',
      price: 99,
    };

    const response = await sut.update(
      String(product.insertedId),
      updatedProduct,
    );

    expect(response.title).toEqual(updatedProduct.title);
    expect(response.description).toEqual(updatedProduct.description);
    expect(response.id).toEqual(product.insertedId);
    expect(response.price).toEqual(99);
  });

  test('Should return BadRequestExepction throws if update throw BadRequestExepction', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut, 'update')
      .mockReturnValueOnce(
        Promise.reject(
          new BadRequestException(
            `Product with ${makeFakeProduct().id} id not found.`,
          ),
        ),
      );
    const promise = sut.update(makeFakeProduct().id, makeFakeProduct());
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return InternalServerError throws if update throw InternalServerError', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut, 'update')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));
    const promise = sut.update(makeFakeProduct().id, makeFakeProduct());
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should return InternalServerError throws if update throws', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut, 'update')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));
    const promise = sut.update(makeFakeProduct().id, makeFakeProduct());
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should delete Product on success', async () => {
    const { sut } = makeSut();
    const Product = await productCollection.insertOne(makeFakeProduct());
    const response = await sut.delete(String(Product.insertedId));

    expect(response.title).toEqual(makeFakeProduct().title);
    expect(response.description).toEqual(makeFakeProduct().description);
    expect(response.id).toEqual(Product.insertedId);
  });

  test('Should return BadRequestExepction on deleted if invalid id', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut, 'delete')
      .mockReturnValueOnce(
        Promise.reject(new BadRequestException('Invalid Product ID format.')),
      );
    const promise = sut.delete(makeFakeProduct().id);
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return BadRequestExepction if id not found ', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut, 'delete')
      .mockReturnValueOnce(
        Promise.reject(
          new BadRequestException(
            `Product with id ${makeFakeProduct().id} not found.`,
          ),
        ),
      );
    const promise = sut.delete(makeFakeProduct().id);
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return InternalServerError throws if delete throw InternalServerError', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut, 'delete')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));
    const promise = sut.delete(makeFakeProduct().id);
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });
});
