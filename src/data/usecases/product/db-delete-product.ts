import { Injectable } from '@nestjs/common';
import { ProductModel } from '@/domain/models/product';
import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';
import { IDbDeleteProductRepository } from '@/data/protocols/db/product/delete-product-respository';
import { ProxySendMessage } from '@/data/protocols/sns/send-message';

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
