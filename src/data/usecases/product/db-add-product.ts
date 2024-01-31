import { Injectable } from '@nestjs/common';
import { ProductModel } from '../../../domain/models/product';
import { AddProductModel } from '../../../presentation/dtos/product/add-product.dto';
import { IDbAddProductRepository } from '../../protocols/db/product/add-product-respository';
import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';

@Injectable()
export class DbAddProduct implements IDbAddProductRepository {
  constructor(private readonly productRepository: ProductMongoRepository) {}

  async create(payload: AddProductModel): Promise<ProductModel> {
    return await this.productRepository.create(payload);
  }
}
