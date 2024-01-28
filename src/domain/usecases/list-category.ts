import { CategoryModel } from '../models/category';

export interface ListCategory {
  execute(): Promise<CategoryModel[]>;
}
