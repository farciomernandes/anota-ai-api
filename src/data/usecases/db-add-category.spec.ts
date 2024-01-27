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
  const fakeRequestData = {
    title: 'any_title',
    description: 'any_description',
    ownerId: 'any_ownerId',
  };

  test('Should call AddCategoryRepository with correct values', async () => {
    const { sut, addCategoryRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addCategoryRepositoryStub, 'create');
    await sut.execute(fakeRequestData);
    expect(addSpy).toBeCalledWith(fakeRequestData);
  });

  test('Should throws if AddCategoryRepository throws', async () => {
    const { sut, addCategoryRepositoryStub } = makeSut();
    jest
      .spyOn(addCategoryRepositoryStub, 'create')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.execute(fakeRequestData);
    expect(promise).rejects.toThrow();
  });

  test('Should category on success', async () => {
    const { sut } = makeSut();

    const response = await sut.execute(fakeRequestData);
    expect(response).toEqual(makeFakeCategory());
  });
});
