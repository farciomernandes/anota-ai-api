import { Injectable } from '@nestjs/common';
import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';
import { IDbListProductRepository } from '../../protocols/db/product/list-product-respository';

@Injectable()
export class DbListProduct implements IDbListProductRepository {
  constructor(
    private readonly productMongoRepository: ProductMongoRepository,
  ) {}
  getAll(): Promise<any> {
    return this.productMongoRepository.getAll();
  }
}
