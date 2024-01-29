import { CategoryMongoRepository } from '../../infra/db/mongodb/category/category-mongo-repository';
import { CategoryModel } from '../../domain/models/category';
import { AddCategoryModel } from '../../presentation/dtos/category/add-category.dto';
import { DbAddCategory } from './db-add-category';

const makeFakeCategory = (): CategoryModel => ({
  id: 'any_id',
  title: 'any_title',
  description: 'any_description',
  ownerId: 'any_ownerId',
});

const makeCategoryMongoRepository = (): CategoryMongoRepository => {
  class CategoryRepositoryStub implements CategoryMongoRepository {
    update(id: string, payload: AddCategoryModel): Promise<CategoryModel> {
      return new Promise((resolve) => resolve(makeFakeCategory()));
    }
    getAll(): Promise<CategoryModel[]> {
      throw new Error('Method not implemented.');
    }
    create(payload: AddCategoryModel): Promise<CategoryModel> {
      return new Promise((resolve) => resolve(makeFakeCategory()));
    }
  }

  return new CategoryRepositoryStub();
};

interface SutTypes {
  sut: DbAddCategory;
  addCategoryRepositoryStub: CategoryMongoRepository;
}

const makeSut = (): SutTypes => {
  const addCategoryRepositoryStub = makeCategoryMongoRepository();
  const sut = new DbAddCategory(addCategoryRepositoryStub);

  return {
    sut,
    addCategoryRepositoryStub,
  };
};

describe('DbAddCategory usecase', () => {
  const fakeRequestData = {
    title: 'any_title',
    description: 'any_description',
    ownerId: 'any_ownerId',
  };

  test('Should call CategoryMongoRepository with correct values', async () => {
    const { sut, addCategoryRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addCategoryRepositoryStub, 'create');
    await sut.create(fakeRequestData);
    expect(addSpy).toBeCalledWith(fakeRequestData);
  });

  test('Should throws if CategoryMongoRepository throws', async () => {
    const { sut, addCategoryRepositoryStub } = makeSut();
    jest
      .spyOn(addCategoryRepositoryStub, 'create')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.create(fakeRequestData);
    expect(promise).rejects.toThrow();
  });

  test('Should return category on success', async () => {
    const { sut } = makeSut();

    const response = await sut.create(fakeRequestData);
    expect(response).toEqual(makeFakeCategory());
  });
});
