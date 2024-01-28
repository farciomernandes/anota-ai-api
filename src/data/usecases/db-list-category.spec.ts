import { CategoryMongoRepository } from '../../infra/db/mongodb/category/category-mongo-repository';
import { CategoryModel } from '../../domain/models/category';
import { AddCategoryModel } from '../../presentation/dtos/category/add-category.dto';
import { DbListCategory } from './db-list-category';

const makeFakeCategory = (): CategoryModel => ({
  id: 'any_id',
  title: 'any_title',
  description: 'any_description',
  ownerId: 'any_ownerId',
});

const makeCategoryMongoRepository = (): CategoryMongoRepository => {
  class CategoryRepositoryStub implements CategoryMongoRepository {
    update(id: string, payload: AddCategoryModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
    getAll(): Promise<CategoryModel[]> {
      return new Promise((resolve) => resolve([makeFakeCategory()]));
    }
    create(payload: AddCategoryModel): Promise<CategoryModel> {
      return new Promise((resolve) => resolve(makeFakeCategory()));
    }
  }

  return new CategoryRepositoryStub();
};

interface SutTypes {
  sut: DbListCategory;
  listCategoryRepositoryStub: CategoryMongoRepository;
}

const makeSut = (): SutTypes => {
  const listCategoryRepositoryStub = makeCategoryMongoRepository();
  const sut = new DbListCategory(listCategoryRepositoryStub);

  return {
    sut,
    listCategoryRepositoryStub,
  };
};

describe('DbListCategory usecase', () => {
  test('Should call CategoryMongoRepository', async () => {
    const { sut, listCategoryRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(listCategoryRepositoryStub, 'getAll');
    await sut.getAll();
    expect(addSpy).toBeCalledWith();
  });

  test('Should throws if CategoryMongoRepository throws', async () => {
    const { sut, listCategoryRepositoryStub } = makeSut();
    jest
      .spyOn(listCategoryRepositoryStub, 'getAll')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.getAll();
    expect(promise).rejects.toThrow();
  });

  test('Should return category array on success', async () => {
    const { sut } = makeSut();

    const response = await sut.getAll();
    expect(response).toEqual([makeFakeCategory()]);
  });
});
