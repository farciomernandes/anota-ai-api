import { CategoryModel } from '@/core/domain/models/category';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';

export abstract class IDbUpdateCategoryRepository {
  abstract update(
    id: string,
    payload: Omit<AddCategoryModel, 'ownerId'>,
    user: Authenticated,
  ): Promise<CategoryModel>;
}
