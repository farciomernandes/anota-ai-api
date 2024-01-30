import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryModel } from '../../../domain/models/category';
import { AddCategoryModel } from '../../../presentation/dtos/category/add-category.dto';
import { IDbAddCategoryRepository } from '../../../data/protocols/db/add-category-respository';
import { IDbListCategoryRepository } from '../../../data/protocols/db/list-category-respository';
import { IDbUpdateCategoryRepository } from '../../../data/protocols/db/update-category-respository';
import { IDbDeleteCategoryRepository } from '../../../data/protocols/db/delete-category-respository';

@ApiTags('category')
@Controller('api/v1/category')
export class CategoryController {
  constructor(
    private readonly dbAddCategory: IDbAddCategoryRepository,
    private readonly dbListCategory: IDbListCategoryRepository,
    private readonly dbUpdateCategory: IDbUpdateCategoryRepository,
    private readonly dbDeleteCategory: IDbDeleteCategoryRepository,
  ) {}

  @Post()
  async create(@Body() payload: AddCategoryModel): Promise<CategoryModel> {
    try {
      return await this.dbAddCategory.create(payload);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Get()
  async getAll(): Promise<CategoryModel[]> {
    try {
      return await this.dbListCategory.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
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
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<CategoryModel> {
    try {
      const response = await this.dbDeleteCategory.delete(id);

      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
