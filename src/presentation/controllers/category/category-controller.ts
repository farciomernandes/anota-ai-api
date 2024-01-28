import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryModel } from '../../../domain/models/category';
import { AddCategoryModel } from '../../../presentation/dtos/category/add-category.dto';
import { IDbAddCategoryRepository } from '../../../data/protocols/db/add-category-respository';
import { IDbListCategoryRepository } from '../../../data/protocols/db/list-category-respository';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly dbAddCategory: IDbAddCategoryRepository,
    private readonly dbListCategory: IDbListCategoryRepository,
  ) {}

  @Post()
  async create(@Body() payload: AddCategoryModel): Promise<CategoryModel> {
    try {
      return await this.dbAddCategory.create(payload);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async getAll(): Promise<any> {
    try {
      return await this.dbListCategory.getAll();
    } catch (error) {
      console.log(error);
    }
  }
}
