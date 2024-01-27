import { CategoryModel } from 'src/domain/models/category';
import { AddCategoryModel } from 'src/presentation/dtos/category/add-category.dto';

export interface AddCategory {
  execute(payload: AddCategoryModel): Promise<CategoryModel>;
}
