import { CategoryModel } from '@/core/domain/models/category';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';

export abstract class IDbDeleteCategoryRepository {
  abstract delete(id: string, user: Authenticated): Promise<CategoryModel>;
}
