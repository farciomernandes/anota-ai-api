import { AddCategoryModel } from 'src/presentation/dtos/category/add-category.dto';
import { IDbUpdateCategoryRepository } from '../protocols/db/update-category-respository';
import { CategoryMongoRepository } from 'src/infra/db/mongodb/category/category-mongo-repository';

export class DbUpdateCategory implements IDbUpdateCategoryRepository {
  constructor(
    private readonly categoryMongoRepository: CategoryMongoRepository,
  ) {}
  async update(id: string, payload: AddCategoryModel): Promise<void> {
    await this.categoryMongoRepository.update(id, payload);
  }
}
