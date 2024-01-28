import { CategoryModel } from 'src/domain/models/category';

export abstract class IDbListCategoryRepository {
  abstract getAll(): Promise<CategoryModel[]>;
}
