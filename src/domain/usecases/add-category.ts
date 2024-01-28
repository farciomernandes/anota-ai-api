import { CategoryModel } from '../../domain/models/category';
import { AddCategoryModel } from '../../presentation/dtos/category/add-category.dto';

export interface AddCategory {
  execute(payload: AddCategoryModel): Promise<CategoryModel>;
}
