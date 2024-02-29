import { IDbAddCategoryRepository } from '../protocols/db/category/add-category-respository';
import { IDbListCategoryRepository } from '../protocols/db/category/list-category-respository';
import { IDbUpdateCategoryRepository } from '../protocols/db/category/update-category-respository';
import { IDbDeleteCategoryRepository } from '../protocols/db/category/delete-category-respository';
import { IDbFindByTitleCategoryRepository } from '../protocols/db/category/find-by-title-category-respository';
import { IDbFindByIdcategoryRepository } from '../protocols/db/category/find-by-id-category-respository';
import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';
import { CategoryModel } from '../models/category';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';

export abstract class CategoryRepository
  implements
    IDbAddCategoryRepository,
    IDbListCategoryRepository,
    IDbUpdateCategoryRepository,
    IDbDeleteCategoryRepository,
    IDbFindByTitleCategoryRepository,
    IDbFindByIdcategoryRepository
{
  abstract findById(id: string): Promise<CategoryModel>;
  abstract findByTitle(title: string): Promise<boolean>;
  abstract delete(id: string, user: Authenticated): Promise<CategoryModel>;
  abstract update(
    id: string,
    payload: Omit<AddCategoryModel, 'ownerId'>,
    user: Authenticated,
  ): Promise<CategoryModel>;
  abstract getAll(): Promise<CategoryModel[]>;
  abstract create(payload: AddCategoryModel): Promise<CategoryModel>;
}
