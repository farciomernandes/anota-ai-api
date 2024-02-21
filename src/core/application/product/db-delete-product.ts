import { Injectable } from '@nestjs/common';
import { ProductModel } from '@/core/domain/models/product';
import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { IDbDeleteProductRepository } from '../../domain/protocols/db/product/delete-product-respository';

@Injectable()
export class DbDeleteProduct implements IDbDeleteProductRepository {
  constructor(
    private readonly productMongoRepositoy: ProductMongoRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}
  async delete(id: string): Promise<ProductModel> {
    const product = await this.productMongoRepositoy.delete(id);
    await this.snsProxy.sendSnsMessage(
      {
        ownerId: product.ownerId,
        id: product.id,
      },
      'remove:product',
    );
    return product;
  }
}
