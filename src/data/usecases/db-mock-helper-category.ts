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
    async delete(id: string): Promise<CategoryModel> {
      return Promise.resolve(makeFakeCategory());
    }
    async update(
      id: string,
      payload: AddCategoryModel,
    ): Promise<CategoryModel> {
      return Promise.resolve(makeFakeCategory());
    }
    async getAll(): Promise<CategoryModel[]> {
      return Promise.resolve([makeFakeCategory()]);
    }
    async create(payload: AddCategoryModel): Promise<CategoryModel> {
      return Promise.resolve(makeFakeCategory());
    }
  }

  return new CategoryRepositoryStub();
};
