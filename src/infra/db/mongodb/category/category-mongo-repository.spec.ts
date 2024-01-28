import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { CategoryMongoRepository } from './category-mongo-repository';
import { CategoryModel } from '../../../../domain/models/category';

const makeFakeCategory = (): CategoryModel => ({
  id: 'any_id',
  title: 'any_title',
  description: 'any_description',
  ownerId: 'any_ownerId',
});

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
    const response = await sut.getAll();
    expect(response).toEqual([]);
  });
});
