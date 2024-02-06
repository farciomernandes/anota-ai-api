import { Injectable } from '@nestjs/common';
import { ProductModel } from '../../../domain/models/product';
import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';
import { IDbDeleteProductRepository } from '../../protocols/db/product/delete-product-respository';
import { ProxySendMessage } from '../../../data/protocols/sns/send-message';

@Injectable()
export class DbDeleteProduct implements IDbDeleteProductRepository {
  constructor(
    private readonly ProductMongoRepositoy: ProductMongoRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}
  async delete(id: string): Promise<ProductModel> {
    await this.snsProxy.sendSnsMessage(
      {
        ownerId: 'valid-ownerId',
      },
      'delete:product',
    );
    return await this.ProductMongoRepositoy.delete(id);
  }
}
