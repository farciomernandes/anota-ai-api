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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryModel } from '@/core/domain/models/category';
import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';
import { IDbAddCategoryRepository } from '@/core/domain/protocols/db/category/add-category-respository';
import { IDbListCategoryRepository } from '@/core/domain/protocols/db/category/list-category-respository';
import { IDbUpdateCategoryRepository } from '@/core/domain/protocols/db/category/update-category-respository';
import { IDbDeleteCategoryRepository } from '@/core/domain/protocols/db/category/delete-category-respository';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/roles.decorator';

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
  @Roles(RolesEnum.ADMIN, RolesEnum.STORE)
  @ApiBearerAuth()
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
  @Roles(RolesEnum.ADMIN, RolesEnum.STORE)
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
  @Roles(RolesEnum.ADMIN, RolesEnum.STORE)
  @ApiBearerAuth()
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
  @Roles(RolesEnum.ADMIN, RolesEnum.STORE)
  @ApiBearerAuth()
  async delete(@Param('id') id: string): Promise<CategoryModel> {
    try {
      const response = await this.dbDeleteCategory.delete(id);

      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
