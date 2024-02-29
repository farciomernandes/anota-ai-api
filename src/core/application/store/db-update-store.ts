import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { IDbUpdateStoreRepository } from '@/core/domain/protocols/db/store/update-store-respository';
import { StoreModel } from '@/core/domain/models/store';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';
import { StoreRepository } from '@/core/domain/repositories/store-repository';

@Injectable()
export class DbUpdateStore implements IDbUpdateStoreRepository {
  constructor(private readonly storeMongoRepository: StoreRepository) {}
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
