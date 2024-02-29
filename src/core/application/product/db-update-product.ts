import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductModel } from '@/core/domain/models/product';
import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { IDbUpdateProductRepository } from '../../domain/protocols/db/product/update-product-respository';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { ProductRepository } from '@/core/domain/repositories/product-repository';

@Injectable()
export class DbUpdateProduct implements IDbUpdateProductRepository {
  constructor(
    private readonly productMongoRepository: ProductRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}
  async update(
    id: string,
    payload: UpdateProductModel,
    user: Authenticated,
  ): Promise<ProductModel> {
    const product = await this.productMongoRepository.findById(id);

    if (product.ownerId !== user.id && user.roles.value !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    const updated = await this.productMongoRepository.update(id, payload, user);
    await this.snsProxy.sendSnsMessage(updated, 'product');
    return updated;
  }
}
