import { CategoryModel } from 'src/domain/models/category';
import { AddCategoryModel } from 'src/presentation/dtos/category/add-category.dto';
import { IDbAddCategoryRepository } from '../protocols/db/add-category-respository';
import { AddCategory } from 'src/domain/usecases/add-category';

export class DbAddCategory implements AddCategory {
  constructor(
    private readonly addCategoryRepositorie: IDbAddCategoryRepository,
  ) {}
  async execute(payload: AddCategoryModel): Promise<CategoryModel> {
    await this.addCategoryRepositorie.create(payload);
    return;
  }
}
