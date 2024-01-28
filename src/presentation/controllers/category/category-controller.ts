import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryModel } from 'src/domain/models/category';
import { AddCategoryModel } from 'src/presentation/dtos/category/add-category.dto';
import { DbAddCategory } from 'src/data/usecases/db-add-category';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly dbAddCategory: DbAddCategory) {}

  @Post()
  async create(@Body() payload: AddCategoryModel): Promise<CategoryModel> {
    try {
      return await this.dbAddCategory.create(payload);
    } catch (error) {
      console.log(error);
    }
  }
}
