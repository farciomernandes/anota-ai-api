import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { IDbDeleteStoreRepository } from '@/core/domain/protocols/db/store/delete-store-respository';
import { StoreModel } from '@/core/domain/models/store';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { StoreRepository } from '@/core/domain/repositories/store-repository';

@Injectable()
export class DbDeleteStore implements IDbDeleteStoreRepository {
  constructor(private readonly storeMongoRepository: StoreRepository) {}
  async delete(id: string, user: Authenticated): Promise<StoreModel> {
    const store = await this.storeMongoRepository.findById(id);

    if (store.id !== user.id && user.roles.value !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    const storeUpdated = await this.storeMongoRepository.delete(id);

    return storeUpdated;
  }
}
