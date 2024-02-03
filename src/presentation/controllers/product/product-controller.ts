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
import { ProductModel } from '../../../domain/models/product';
import { AddProductModel } from '../../dtos/product/add-product.dto';
import { IDbAddProductRepository } from '../../../data/protocols/db/product/add-product-respository';
import { IDbListProductRepository } from '../../../data/protocols/db/product/list-product-respository';
import { IDbUpdateProductRepository } from '../../../data/protocols/db/product/update-product-respository';
import { IDbDeleteProductRepository } from '../../../data/protocols/db/product/delete-product-respository';
import { UpdateProductModel } from '../../../presentation/dtos/product/update-product.dto';

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
  async create(@Body() payload: AddProductModel): Promise<ProductModel> {
    try {
      return await this.dbAddProduct.create(payload);
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
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateProductModel,
  ): Promise<ProductModel> {
    try {
      return await this.dbUpdateProduct.update(id, payload);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete('/:id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ProductModel,
  })
  async delete(@Param('id') id: string): Promise<ProductModel> {
    try {
      const response = await this.dbDeleteProduct.delete(id);

      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
