import { CategoryModel } from '@/core/domain/models/category';
import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';

export abstract class IDbAddCategoryRepository {
  abstract create(payload: AddCategoryModel): Promise<CategoryModel>;
}
