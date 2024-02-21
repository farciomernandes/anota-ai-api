import { CategoryModel } from '@/core/domain/models/category';

export abstract class IDbListCategoryRepository {
  abstract getAll(): Promise<CategoryModel[]>;
}
