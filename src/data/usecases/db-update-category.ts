import { AddCategoryModel } from '../../presentation/dtos/category/add-category.dto';
import { IDbUpdateCategoryRepository } from '../protocols/db/update-category-respository';
import { CategoryMongoRepository } from '../../infra/db/mongodb/category/category-mongo-repository';
import { Injectable } from '@nestjs/common';
import { CategoryModel } from '../../domain/models/category';

@Injectable()
export class DbUpdateCategory implements IDbUpdateCategoryRepository {
  constructor(
    private readonly categoryMongoRepository: CategoryMongoRepository,
  ) {}
  async update(id: string, payload: AddCategoryModel): Promise<CategoryModel> {
    return await this.categoryMongoRepository.update(id, payload);
  }
}
