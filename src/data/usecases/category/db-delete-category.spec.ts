import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import {
  makeCategoryMongoRepository,
  makeFakeCategory,
} from '../../../domain/test/mock/db-mock-helper-category';
import { DbDeleteCategory } from './db-delete-category';

type SutTypes = {
  sut: DbDeleteCategory;
  deleteCategoryRepositoryStub: CategoryMongoRepository;
};

const makeSut = (): SutTypes => {
  const deleteCategoryRepositoryStub = makeCategoryMongoRepository();
  const sut = new DbDeleteCategory(deleteCategoryRepositoryStub);

  return {
    sut,
    deleteCategoryRepositoryStub,
  };
};
describe('DbDeleteCategory usecase', () => {
  test('Should call CategoryMongoRepository with correct values', async () => {
    const { sut, deleteCategoryRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteCategoryRepositoryStub, 'delete');
    await sut.delete(makeFakeCategory().id);
    expect(deleteSpy).toBeCalledWith(makeFakeCategory().id);
  });
});
