import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductModel } from '@/core/domain/models/product';
import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { IDbDeleteProductRepository } from '../../domain/protocols/db/product/delete-product-respository';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { RolesEnum } from '@/shared/enums/roles.enum';

@Injectable()
export class DbDeleteProduct implements IDbDeleteProductRepository {
  constructor(
    private readonly productMongoRepository: ProductMongoRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}
  async delete(id: string, user: Authenticated): Promise<ProductModel> {
    const product = await this.productMongoRepository.findById(id);

    if (product.ownerId !== user.id && user.roles.value !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    const productUpdated = await this.productMongoRepository.delete(id);

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
