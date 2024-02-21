import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';
import { Injectable } from '@nestjs/common';
import { ProductModel } from '@/core/domain/models/product';
import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { IDbUpdateProductRepository } from '../../domain/protocols/db/product/update-product-respository';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';

@Injectable()
export class DbUpdateProduct implements IDbUpdateProductRepository {
  constructor(
    private readonly productMongoRepository: ProductMongoRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}
  async update(id: string, payload: UpdateProductModel): Promise<ProductModel> {
    const updated = await this.productMongoRepository.update(id, payload);
    await this.snsProxy.sendSnsMessage(updated, 'product');
    return updated;
  }
}
