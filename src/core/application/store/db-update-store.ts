import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { IDbUpdateStoreRepository } from '@/core/domain/protocols/db/store/update-store-respository';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { AddStoreModel } from '@/presentation/dtos/role/add-role.dto';
import { StoreModel } from '@/core/domain/models/store';

@Injectable()
export class DbUpdateStore implements IDbUpdateStoreRepository {
  constructor(private readonly storeMongoRepository: StoreMongoRepository) {}
  async update(
    id: string,
    payload: AddStoreModel,
    user: Authenticated,
  ): Promise<StoreModel> {
    const store = await this.storeMongoRepository.findById(id);

    if (store.id !== user.id && user.roles.value !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    const storeUpdated = await this.storeMongoRepository.update(id, payload);

    return storeUpdated;
  }
}
