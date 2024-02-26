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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductModel } from '@/core/domain/models/product';
import { AddProductModel } from '@/presentation/dtos/product/add-product.dto';
import { IDbAddProductRepository } from '@/core/domain/protocols/db/product/add-product-respository';
import { IDbListProductRepository } from '@/core/domain/protocols/db/product/list-product-respository';
import { IDbUpdateProductRepository } from '@/core/domain/protocols/db/product/update-product-respository';
import { IDbDeleteProductRepository } from '@/core/domain/protocols/db/product/delete-product-respository';
import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from '@/infra/config/multer';
import { Roles } from '@/shared/decorators/roles.decorator';
import { RolesGuard } from '@/infra/guards/roles.guard';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { User } from '@/shared/decorators/user.decorator';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
@ApiTags('Product')
@Controller('api/v1/product')
export class ProductController {
  constructor(
    private readonly dbAddProduct: IDbAddProductRepository,
    private readonly dbListProduct: IDbListProductRepository,
    private readonly dbUpdateProduct: IDbUpdateProductRepository,
    private readonly dbDeleteProduct: IDbDeleteProductRepository,
  ) {}

  @Post()
  @ApiBody({
    type: AddProductModel,
    description:
      'Insert item in existing cart or create new cart with this item',
  })
  @ApiOkResponse({
    description: 'Returns products.',
    status: HttpStatus.OK,
    type: ProductModel,
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @Roles(RolesEnum.ADMIN, RolesEnum.STORE)
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: Omit<AddProductModel, 'file'>,
  ): Promise<ProductModel> {
    try {
      return await this.dbAddProduct.create(payload, file);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns products.',
    status: HttpStatus.OK,
    type: ProductModel,
  })
  async getAll(): Promise<ProductModel[]> {
    try {
      return await this.dbListProduct.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Put('/:id')
  @Post()
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ProductModel,
  })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateProductModel,
    @User() user: Authenticated,
  ): Promise<ProductModel> {
    try {
      return await this.dbUpdateProduct.update(id, payload, user);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete('/:id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ProductModel,
  })
  @ApiBearerAuth()
  async delete(
    @Param('id') id: string,
    @User() user: Authenticated,
  ): Promise<ProductModel> {
    try {
      const response = await this.dbDeleteProduct.delete(id, user);

      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
