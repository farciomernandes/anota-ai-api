import { IDbListStoreRepository } from '@/core/domain/protocols/db/store/list-store-respository';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbListStore implements IDbListStoreRepository {
  constructor(private readonly storeMongoRepository: StoreMongoRepository) {}

  async getAll(): Promise<any> {
    return this.storeMongoRepository.getAll();
  }
}
