import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductModel } from '@/core/domain/models/product';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { IDbDeleteProductRepository } from '../../domain/protocols/db/product/delete-product-respository';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { ProductRepository } from '@/core/domain/repositories/product-repository';

@Injectable()
export class DbDeleteProduct implements IDbDeleteProductRepository {
  constructor(
    private readonly productMongoRepository: ProductRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}
  async delete(id: string, user: Authenticated): Promise<ProductModel> {
    const product = await this.productMongoRepository.findById(id);

    if (product.ownerId !== user.id && user.roles.value !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    const productUpdated = await this.productMongoRepository.delete(id, user);

    await this.snsProxy.sendSnsMessage(
      {
        ownerId: productUpdated.ownerId,
        id: productUpdated.id,
      },
      'remove:product',
    );
    return product;
  }
}
