import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { CategoryMongoRepository } from './category-mongo-repository';
import { makeFakeCategory } from '../../../../data/usecases/db-mock-helper-category';

interface SutTypes {
  sut: CategoryMongoRepository;
}
const makeSut = (): SutTypes => {
  const sut = new CategoryMongoRepository();

  return {
    sut,
  };
};

describe('Category Mongo Repository', () => {
  let categoryCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    categoryCollection = await MongoHelper.getCollection('categories');
    await categoryCollection.deleteMany({});
  });

  test('Should create an category on success', async () => {
    const { sut } = makeSut();
    await sut.create(makeFakeCategory());
    const count = await categoryCollection.countDocuments();
    expect(count).toBe(1);
  });

  test('Should list categories on success', async () => {
    const { sut } = makeSut();

    const fakeCategory1 = makeFakeCategory();
    const fakeCategory2 = makeFakeCategory();
    await categoryCollection.insertMany([fakeCategory1, fakeCategory2]);

    const response = await sut.getAll();

    const expectedOutput = [
      MongoHelper.map(fakeCategory1),
      MongoHelper.map(fakeCategory2),
    ];

    expect(response).toEqual(expectedOutput);
  });

  test('Should update category on success', async () => {
    const { sut } = makeSut();

    const fakeCategory = makeFakeCategory();
    const category = await categoryCollection.insertOne(fakeCategory);

    const updatedCategory = {
      title: 'other_title',
      description: 'other_description',
    };

    const response = await sut.update(
      String(category.insertedId),
      updatedCategory,
    );

    expect(response.title).toEqual(updatedCategory.title);
    expect(response.description).toEqual(updatedCategory.description);
    expect(response.id).toEqual(fakeCategory.id);
  });
});
