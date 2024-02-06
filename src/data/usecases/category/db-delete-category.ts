import { Injectable } from '@nestjs/common';
import { CategoryModel } from '@/domain/models/category';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import { IDbDeleteCategoryRepository } from '@/data/protocols/db/category/delete-category-respository';

@Injectable()
export class DbDeleteCategory implements IDbDeleteCategoryRepository {
  constructor(
    private readonly categoryMongoRepositoy: CategoryMongoRepository,
  ) {}
  async delete(id: string): Promise<CategoryModel> {
    return await this.categoryMongoRepositoy.delete(id);
  }
}
