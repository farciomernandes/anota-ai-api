import { AddCategoryModel } from '../../../presentation/dtos/category/add-category.dto';
import { CategoryModel } from '../../../domain/models/category';
import { CategoryMongoRepository } from '../../../infra/db/mongodb/category/category-mongo-repository';

export const makeFakeCategory = (): CategoryModel => {
  const category = new CategoryModel();
  category.id = 'any_id';
  category.title = 'any_title';
  category.ownerId = 'any_ownerId';
  category.description = 'any_description';
  return category;
};

export const makeCategoryMongoRepository = (): CategoryMongoRepository => {
  class CategoryRepositoryStub implements CategoryMongoRepository {
    async findByTitle(title: string): Promise<boolean> {
      return false;
    }
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
