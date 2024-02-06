import { CategoryModel } from '@/domain/models/category';
import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';

export abstract class IDbUpdateCategoryRepository {
  abstract update(
    id: string,
    payload: Omit<AddCategoryModel, 'ownerId'>,
  ): Promise<CategoryModel>;
}
