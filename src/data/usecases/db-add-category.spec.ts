import { CategoryModel } from 'src/domain/models/category';
import { AddCategoryModel } from 'src/presentation/dtos/category/add-category.dto';
import { IDbAddCategoryRepository } from '../protocols/db/add-category-respository';
import { DbAddCategory } from './db-add-category';

const makeFakeCategory = (): CategoryModel => ({
  id: 'any_id',
  title: 'any_title',
  description: 'any_description',
  ownerId: 'any_ownerId',
});

const makeAddCategoryRepository = (): IDbAddCategoryRepository => {
  class CategoryRepositoryStub implements IDbAddCategoryRepository {
    create(payload: AddCategoryModel): Promise<CategoryModel> {
      return new Promise((resolve) => resolve(makeFakeCategory()));
    }
  }

  return new CategoryRepositoryStub();
};

interface SutTypes {
  sut: DbAddCategory;
  addCategoryRepositoryStub: IDbAddCategoryRepository;
}

const makeSut = (): SutTypes => {
  const addCategoryRepositoryStub = makeAddCategoryRepository();
  const sut = new DbAddCategory(addCategoryRepositoryStub);

  return {
    sut,
    addCategoryRepositoryStub,
  };
};

describe('DbAddCategory usecase', () => {
  test('Should call AddCategoryRepository with correct values', async () => {
    const { sut, addCategoryRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addCategoryRepositoryStub, 'create');
    sut.execute({
      title: 'any_title',
      description: 'any_description',
      ownerId: 'any_ownerId',
    });
    expect(addSpy).toBeCalledWith({
      title: 'any_title',
      description: 'any_description',
      ownerId: 'any_ownerId',
    });
  });
});
