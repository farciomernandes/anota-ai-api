import { Injectable } from '@nestjs/common';
import { IDbListProductRepository } from '../../domain/protocols/db/product/list-product-respository';
import { ProductRepository } from '@/core/domain/repositories/product-repository';
import { ProductModel } from '@/core/domain/models/product';

@Injectable()
export class DbListProduct implements IDbListProductRepository {
  constructor(private readonly productMongoRepository: ProductRepository) {}
  getAll(): Promise<ProductModel[]> {
    return this.productMongoRepository.getAll();
  }
}
