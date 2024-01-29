import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryModel } from '../../../domain/models/category';
import { AddCategoryModel } from '../../../presentation/dtos/category/add-category.dto';
import { IDbAddCategoryRepository } from '../../../data/protocols/db/add-category-respository';
import { IDbListCategoryRepository } from '../../../data/protocols/db/list-category-respository';
import { IDbUpdateCategoryRepository } from '../../../data/protocols/db/update-category-respository';

@ApiTags('category')
@Controller('api/v1/category')
export class CategoryController {
  constructor(
    private readonly dbAddCategory: IDbAddCategoryRepository,
    private readonly dbListCategory: IDbListCategoryRepository,
    private readonly dbUpdateCategory: IDbUpdateCategoryRepository,
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
  async getAll(): Promise<CategoryModel[]> {
    try {
      return await this.dbListCategory.getAll();
    } catch (error) {
      console.log(error);
    }
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() payload: Omit<AddCategoryModel, 'ownerId'>,
  ): Promise<CategoryModel> {
    try {
      return await this.dbUpdateCategory.update(id, payload);
    } catch (error) {
      console.log(error);
    }
  }
}
