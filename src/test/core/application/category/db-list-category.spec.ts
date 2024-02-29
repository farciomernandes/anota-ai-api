import { DbListCategory } from '@/core/application/category/db-list-category';
import {
  makeCategoryRepository,
  makeFakeCategory,
} from '@/test/mock/db-mock-helper-category';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';

type SutTypes = {
  sut: DbListCategory;
  listCategoryRepositoryStub: CategoryRepository;
};

const makeSut = (): SutTypes => {
  const listCategoryRepositoryStub = makeCategoryRepository();
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
