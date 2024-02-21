import { CategoryModel } from '@/core/domain/models/category';

export abstract class IDbDeleteCategoryRepository {
  abstract delete(id: string): Promise<CategoryModel>;
}
