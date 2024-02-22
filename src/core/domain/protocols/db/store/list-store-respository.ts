import { StoreModel } from '@/core/domain/models/store';

export abstract class IDbListStoreRepository {
  abstract getAll(): Promise<StoreModel[]>;
}
