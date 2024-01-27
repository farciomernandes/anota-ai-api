import { CategoryModel } from 'src/domain/models/category';
import { AddCategoryModel } from 'src/presentation/dtos/category/add-category.dto';

export abstract class IDbAddCategoryRepository {
  abstract create(payload: AddCategoryModel): Promise<CategoryModel>;
}
