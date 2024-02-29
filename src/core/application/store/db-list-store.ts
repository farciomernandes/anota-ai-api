import { IDbListStoreRepository } from '@/core/domain/protocols/db/store/list-store-respository';
import { StoreRepository } from '@/core/domain/repositories/store-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbListStore implements IDbListStoreRepository {
  constructor(private readonly storeMongoRepository: StoreRepository) {}

  async getAll(): Promise<any> {
    return this.storeMongoRepository.getAll();
  }
}
