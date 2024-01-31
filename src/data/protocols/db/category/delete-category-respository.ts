import { CategoryModel } from '../../../../domain/models/category';

export abstract class IDbDeleteCategoryRepository {
  abstract delete(id: string): Promise<CategoryModel>;
}
