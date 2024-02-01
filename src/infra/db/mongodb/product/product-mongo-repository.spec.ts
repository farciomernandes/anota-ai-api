import { MongoHelper } from '../helpers/mongo-helper';
import { ProductMongoRepository } from './product-mongo-repository';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { makeFakeProduct } from '../../../../data/usecases/product/db-mock-helper-product';
import { UpdateProductModel } from '../../../../presentation/dtos/product/update-product.dto';
import { makeFakeCategory } from '../../../../data/usecases/category/db-mock-helper-category';
import { Collection } from 'mongodb';

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
  let categoryCollection: Collection;

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
    categoryCollection = await MongoHelper.getCollection('categories');
    await productCollection.deleteMany({});
  });

  test('Should create Product on success', async () => {
    const { sut } = makeSut();

    const fakeProduct = makeFakeProduct();
    const category = await categoryCollection.insertOne(makeFakeCategory());
    const response = await sut.create({
      ...fakeProduct,
      categoryId: category.insertedId.toHexString(),
    });

    expect(response.title).toEqual(fakeProduct.title);
  });

  test('Should return BadRequestException if send category_id invalid', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'create')
      .mockReturnValueOnce(Promise.reject(new BadRequestException()));

    const promise = sut.create(fakeRequest);

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return InternalServerError throws if create throw InternalServerError', async () => {
    const { sut } = makeSut();

    jest.mock('../helpers/mongo-helper');
    jest
      .spyOn(MongoHelper, 'getCollection')
      .mockRejectedValueOnce(new InternalServerErrorException());

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
    jest.mock('../helpers/mongo-helper');
    jest
      .spyOn(MongoHelper, 'getCollection')
      .mockRejectedValueOnce(new InternalServerErrorException());

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
    jest.mock('../helpers/mongo-helper');
    jest
      .spyOn(MongoHelper, 'getCollection')
      .mockRejectedValueOnce(new InternalServerErrorException());

    const promise = sut.update(makeFakeProduct().id, makeFakeProduct());
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should throw BadRequestException if no product is found to update', async () => {
    const { sut } = makeSut();
    const nonExistentProductId = 'non_existent_id';

    jest.spyOn(sut, 'update').mockImplementationOnce(async (id, payload) => {
      return new Promise((resolve, reject) => {
        reject(new BadRequestException(`Product with ${id} id not found.`));
      });
    });

    const promise = sut.update(nonExistentProductId, makeFakeProduct());

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should delete Product on success', async () => {
    const { sut } = makeSut();
    const product = await productCollection.insertOne(makeFakeProduct());
    const response = await sut.delete(product.insertedId.toHexString());

    expect(response.title).toEqual(makeFakeProduct().title);
    expect(response.description).toEqual(makeFakeProduct().description);
    expect(response.id).toEqual(product.insertedId);
  });

  test('Should return BadRequestExepction on delete if invalid id', async () => {
    const { sut } = makeSut();

    const promise = sut.delete('invalid_id');
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return BadRequestException on delete if id not found', async () => {
    const { sut } = makeSut();

    jest.mock('../helpers/mongo-helper');

    jest.spyOn(MongoHelper, 'map').mockImplementationOnce(() => false);

    const promise = sut.delete(makeFakeProduct().id);
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return InternalServerError throws if delete throw InternalServerError', async () => {
    const { sut } = makeSut();

    jest.mock('../helpers/mongo-helper');
    jest.spyOn(MongoHelper, 'map').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const promise = sut.delete('5f1a67b143a9d661826f8ce7');
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should return true if findByTitle seach a procut', async () => {
    const { sut } = makeSut();
    const findSpy = jest.spyOn(sut, 'findByTitle');
    await productCollection.insertOne(makeFakeProduct());

    const response = await sut.findByTitle(makeFakeProduct().title);

    expect(findSpy).toHaveBeenLastCalledWith(makeFakeProduct().title);
    expect(response).toBe(true);
  });

  test('Should return false if findByTitle not find a procut', async () => {
    const { sut } = makeSut();
    const findSpy = jest.spyOn(sut, 'findByTitle');
    const response = await sut.findByTitle(makeFakeProduct().title);

    expect(findSpy).toHaveBeenLastCalledWith(makeFakeProduct().title);
    expect(response).toBe(false);
  });

  test('Should return false if findByTitle not find a procut', async () => {
    const { sut } = makeSut();

    jest.mock('../helpers/mongo-helper');
    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });
    const promise = sut.findByTitle(makeFakeProduct().title);

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });
});
