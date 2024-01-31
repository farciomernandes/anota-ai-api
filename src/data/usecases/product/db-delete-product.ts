import { Injectable } from '@nestjs/common';
import { ProductModel } from '../../../domain/models/product';
import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';
import { IDbDeleteProductRepository } from '../../protocols/db/product/delete-product-respository';

@Injectable()
export class DbDeleteProduct implements IDbDeleteProductRepository {
  constructor(private readonly ProductMongoRepositoy: ProductMongoRepository) {}
  async delete(id: string): Promise<ProductModel> {
    return await this.ProductMongoRepositoy.delete(id);
  }
}
