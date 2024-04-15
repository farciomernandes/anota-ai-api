import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { Collection } from 'mongodb';
import { makeFakeCategory } from '@/test/mock/db-mock-helper-category';
import { makeFakeProduct } from '@/test/mock/db-mock-helper-product';
import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';

type SutTypes = {
  sut: ProductMongoRepository;
};
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
  const file = {} as Express.Multer.File;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    const response = await sut.create(
      {
        ...fakeProduct,
        categoryId: category.insertedId.toHexString(),
      },
      file,
    );

    expect(response.title).toEqual(fakeProduct.title);
  });

  test('Should return BadRequestException if send category_id invalid', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'create')
      .mockReturnValueOnce(Promise.reject(new BadRequestException()));

    const promise = sut.create(fakeRequest, file);

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return InternalServerError throws if create throw InternalServerError', async () => {
    const { sut } = makeSut();

    jest.mock('@/infra/db/mongodb/helpers/mongo-helper');
    const fakeProduct = makeFakeProduct();
    const category = await categoryCollection.insertOne(makeFakeCategory());

    jest
      .spyOn(MongoHelper, 'getCollection')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));
    const promise = sut.create(
      {
        ...fakeProduct,
        categoryId: category.insertedId.toHexString(),
      },
      file,
    );
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should list products on success', async () => {
    const { sut } = makeSut();
    await categoryCollection.insertOne(makeFakeCategory());

    const fakeProduct = {
      categoryId: makeFakeCategory().id,
      description: 'any_description',
      ownerId: '65bbfb669aa71009ff86302d',
      title: 'any_title',
    };

    await productCollection.insertOne(fakeProduct);

    const response = await sut.getAll();

    expect(Array.isArray(response)).toBe(true);
  });

  test('Should return InternalServerError throws if getAll throw InternalServerError', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'getAll')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));

    const promise = sut.getAll();
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should return InternalServerError throws if getAll throw InternalServerError', async () => {
    const { sut } = makeSut();

    jest.mock('@/infra/db/mongodb/helpers/mongo-helper');

    jest
      .spyOn(MongoHelper, 'getCollection')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));

    const promise = sut.getAll();
    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should update Product on success', async () => {
    const { sut } = makeSut();

    const fakeProduct = makeFakeProduct();
    const product = await productCollection.insertOne(fakeProduct);
    const category = await categoryCollection.insertOne(makeFakeCategory());
    const updatedProduct: UpdateProductModel = {
      title: 'other_title',
      description: 'other_description',
      price: 99,
      categoryId: category.insertedId.toHexString(),
    };

    const response = await sut.update(
      String(product.insertedId),
      updatedProduct,
    );

    expect(response.title).toEqual(updatedProduct.title);
    expect(response.description).toEqual(updatedProduct.description);
    expect(response.price).toEqual(99);
  });

  test('Should return BadRequestExepction throws if update throw BadRequestExepction', async () => {
    const { sut } = makeSut();

    const promise = sut.update(makeFakeProduct().id, {
      ...makeFakeProduct(),
      description: 'new_description',
      categoryId: '65b9a4cd77e2de47acb5db37',
    });
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should throw InternalServerError if no product is found to update', async () => {
    const { sut } = makeSut();
    const nonExistentProductId = 'non_existent_id';
    const category = await categoryCollection.insertOne(makeFakeCategory());
    await productCollection.insertOne(makeFakeProduct());

    const promise = sut.update(nonExistentProductId, {
      categoryId: category.insertedId.toHexString(),
      description: makeFakeProduct().description,
      price: makeFakeProduct().price,
      title: makeFakeProduct().title,
    });

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  test('Should return true if findById searched product on success', async () => {
    const { sut } = makeSut();

    const product = await productCollection.insertOne(makeFakeProduct());
    const response = await sut.findById(product.insertedId.toHexString());
    expect(response.title).toEqual(makeFakeProduct().title);
    expect(response.description).toEqual(makeFakeProduct().description);
    expect(response.ownerId).toEqual(makeFakeProduct().ownerId);
  });

  test('Should return InternalServerError throws if findById throw InternalServerError', async () => {
    const { sut } = makeSut();

    jest.mock('@/infra/db/mongodb/helpers/mongo-helper');

    jest
      .spyOn(MongoHelper, 'getCollection')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));

    const response = sut.findById(makeFakeCategory().id);
    await expect(response).rejects.toThrow(InternalServerErrorException);
  });

  test('Should return InternalServerError throws if findByTitle throw InternalServerError', async () => {
    const { sut } = makeSut();

    jest.mock('@/infra/db/mongodb/helpers/mongo-helper');

    jest
      .spyOn(MongoHelper, 'getCollection')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));

    const response = sut.findByTitle(makeFakeProduct().title);
    await expect(response).rejects.toThrow(InternalServerErrorException);
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

    jest.spyOn(sut, 'delete').mockRejectedValueOnce(new BadRequestException());

    const promise = sut.delete('invalid_id');
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return BadRequestException on delete if id not found', async () => {
    const { sut } = makeSut();

    jest.mock('@/infra/db/mongodb/helpers/mongo-helper');

    jest.spyOn(sut, 'delete').mockRejectedValueOnce(new BadRequestException());

    const promise = sut.delete(makeFakeProduct().id);
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return true if findByTitle search a product', async () => {
    const { sut } = makeSut();
    const findSpy = jest.spyOn(sut, 'findByTitle');
    await productCollection.insertOne(makeFakeProduct());

    const response = await sut.findByTitle(makeFakeProduct().title);

    expect(findSpy).toHaveBeenLastCalledWith(makeFakeProduct().title);
    expect(response).toBe(true);
  });

  test('Should return false if findByTitle not find a product', async () => {
    const { sut } = makeSut();
    const findSpy = jest.spyOn(sut, 'findByTitle');
    const response = await sut.findByTitle('false_title');

    expect(findSpy).toHaveBeenLastCalledWith('false_title');
    expect(response).toBe(false);
  });

  test('Should return a product if findByOwnerId is success', async () => {
    const { sut } = makeSut();

    const fakeProduct = makeFakeProduct();
    const category = await categoryCollection.insertOne(makeFakeCategory());
    await sut.create(
      {
        ...fakeProduct,
        categoryId: category.insertedId.toHexString(),
      },
      file,
    );
    const response = await sut.findByOwnerId(makeFakeProduct().ownerId);

    expect(Array.isArray(response)).toBe(true);
    expect(response[0].ownerId).toBe(makeFakeProduct().ownerId);
  });

  test('Should return InternalServerError throws if findByOwnerId throw InternalServerError', async () => {
    const { sut } = makeSut();

    jest.mock('@/infra/db/mongodb/helpers/mongo-helper');

    jest
      .spyOn(MongoHelper, 'getCollection')
      .mockReturnValueOnce(Promise.reject(new InternalServerErrorException()));

    const response = sut.findByOwnerId(makeFakeProduct().ownerId);
    await expect(response).rejects.toThrow(InternalServerErrorException);
  });
});
