import { Injectable } from '@nestjs/common';
import { CategoryModel } from '../../../domain/models/category';
import { AddCategoryModel } from '../../../presentation/dtos/category/add-category.dto';
import { IDbAddCategoryRepository } from '../../protocols/db/category/add-category-respository';
import { CategoryMongoRepository } from '../../../infra/db/mongodb/category/category-mongo-repository';

@Injectable()
export class DbAddCategory implements IDbAddCategoryRepository {
  constructor(private readonly categoryRepository: CategoryMongoRepository) {}

  async create(payload: AddCategoryModel): Promise<CategoryModel> {
    return await this.categoryRepository.create(payload);
  }
}
