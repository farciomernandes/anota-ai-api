import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { IDbDeleteStoreRepository } from '@/core/domain/protocols/db/store/delete-store-respository';
import { StoreModel } from '@/core/domain/models/store';

@Injectable()
export class DbDeleteStore implements IDbDeleteStoreRepository {
  constructor(private readonly storeMongoRepository: StoreMongoRepository) {}
  async delete(id: string, user: Authenticated): Promise<StoreModel> {
    const store = await this.storeMongoRepository.findById(id);

    if (store.id !== user.id && user.roles.value !== 'ADMIN') {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    const storeUpdated = await this.storeMongoRepository.delete(id);

    return storeUpdated;
  }
}
