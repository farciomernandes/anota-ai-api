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
  async create(@Body() payload: AddProductModel): Promise<ProductModel> {
    try {
      return await this.dbAddProduct.create(payload);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Get()
  async getAll(): Promise<ProductModel[]> {
    try {
      return await this.dbListProduct.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Put('/:id')
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
  async delete(@Param('id') id: string): Promise<ProductModel> {
    try {
      const response = await this.dbDeleteProduct.delete(id);

      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
