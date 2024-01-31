import { IDbUpdateProductRepository } from '../../protocols/db/product/update-product-respository';
import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';
import { Injectable } from '@nestjs/common';
import { ProductModel } from '../../../domain/models/product';
import { UpdateProductModel } from '../../../presentation/dtos/product/update-product.dto';

@Injectable()
export class DbUpdateProduct implements IDbUpdateProductRepository {
  constructor(
    private readonly productMongoRepository: ProductMongoRepository,
  ) {}
  async update(id: string, payload: UpdateProductModel): Promise<ProductModel> {
    return await this.productMongoRepository.update(id, payload);
  }
}
