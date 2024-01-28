import { AddCategoryModel } from '../../../presentation/dtos/category/add-category.dto';

export abstract class IDbUpdateCategoryRepository {
  abstract update(id: string, payload: AddCategoryModel): Promise<void>;
}
