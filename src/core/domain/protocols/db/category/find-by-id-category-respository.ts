import { CategoryModel } from '@/core/domain/models/category';

export abstract class IDbFindByIdcategoryRepository {
  abstract findById(id: string): Promise<CategoryModel>;
}
