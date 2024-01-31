import { CategoryModel } from '../../../../domain/models/category';

export abstract class IDbListCategoryRepository {
  abstract getAll(): Promise<CategoryModel[]>;
}
