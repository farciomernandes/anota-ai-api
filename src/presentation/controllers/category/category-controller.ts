import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryModel } from '@/domain/models/category';
import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';
import { IDbAddCategoryRepository } from '@/data/protocols/db/category/add-category-respository';
import { IDbListCategoryRepository } from '@/data/protocols/db/category/list-category-respository';
import { IDbUpdateCategoryRepository } from '@/data/protocols/db/category/update-category-respository';
import { IDbDeleteCategoryRepository } from '@/data/protocols/db/category/delete-category-respository';

@ApiTags('Category')
@Controller('api/v1/category')
export class CategoryController {
  constructor(
    private readonly dbAddCategory: IDbAddCategoryRepository,
    private readonly dbListCategory: IDbListCategoryRepository,
    private readonly dbUpdateCategory: IDbUpdateCategoryRepository,
    private readonly dbDeleteCategory: IDbDeleteCategoryRepository,
  ) {}

  @Post()
  @ApiBody({
    type: AddCategoryModel,
    description:
      'Insert item in existing cart or create new cart with this item',
  })
  @ApiOkResponse({
    description: 'Returns categorys.',
    status: HttpStatus.OK,
    type: CategoryModel,
  })
  async create(@Body() payload: AddCategoryModel): Promise<CategoryModel> {
    try {
      return await this.dbAddCategory.create(payload);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns categorys.',
    status: HttpStatus.OK,
    type: CategoryModel,
    isArray: true,
  })
  async getAll(): Promise<CategoryModel[]> {
    try {
      return await this.dbListCategory.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Put('/:id')
  @ApiBody({
    type: AddCategoryModel,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CategoryModel,
  })
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
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CategoryModel,
  })
  async delete(@Param('id') id: string): Promise<CategoryModel> {
    try {
      const response = await this.dbDeleteCategory.delete(id);

      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
