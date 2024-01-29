import { AddCategoryModel } from '../../presentation/dtos/category/add-category.dto';
import { CategoryModel } from '../../domain/models/category';
import { CategoryMongoRepository } from '../../infra/db/mongodb/category/category-mongo-repository';

export const makeFakeCategory = (): CategoryModel => ({
  id: 'any_id',
  title: 'any_title',
  description: 'any_description',
  ownerId: 'any_ownerId',
});

export const makeCategoryMongoRepository = (): CategoryMongoRepository => {
  class CategoryRepositoryStub implements CategoryMongoRepository {
    update(id: string, payload: AddCategoryModel): Promise<CategoryModel> {
      return Promise.resolve(makeFakeCategory());
    }
    getAll(): Promise<CategoryModel[]> {
      return Promise.resolve([makeFakeCategory()]);
    }
    create(payload: AddCategoryModel): Promise<CategoryModel> {
      return Promise.resolve(makeFakeCategory());
    }
  }

  return new CategoryRepositoryStub();
};
