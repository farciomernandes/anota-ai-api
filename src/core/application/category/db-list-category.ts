import { Injectable } from '@nestjs/common';
import { IDbListCategoryRepository } from '../../domain/protocols/db/category/list-category-respository';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';

@Injectable()
export class DbListCategory implements IDbListCategoryRepository {
  constructor(private readonly categoryMongoRepository: CategoryRepository) {}
  getAll(): Promise<any> {
    return this.categoryMongoRepository.getAll();
  }
}
