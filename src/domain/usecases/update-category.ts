import { CategoryModel } from '../models/category';
import { AddCategoryModel } from '../../presentation/dtos/category/add-category.dto';

export interface UpdateCategory {
  execute(id: string, payload: AddCategoryModel): Promise<CategoryModel>;
}
