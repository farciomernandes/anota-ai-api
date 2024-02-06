import { IDbUpdateProductRepository } from '@/data/protocols/db/product/update-product-respository';
import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';
import { Injectable } from '@nestjs/common';
import { ProductModel } from '@/domain/models/product';
import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { ProxySendMessage } from '@/data/protocols/sns/send-message';

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
