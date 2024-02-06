import { Injectable } from '@nestjs/common';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import { IDbListCategoryRepository } from '@/data/protocols/db/category/list-category-respository';

@Injectable()
export class DbListCategory implements IDbListCategoryRepository {
  constructor(
    private readonly categoryMongoRepository: CategoryMongoRepository,
  ) {}
  getAll(): Promise<any> {
    return this.categoryMongoRepository.getAll();
  }
}
