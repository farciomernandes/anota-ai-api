import { StoreModel } from '@/core/domain/models/store';

export abstract class IDbFindStoreByIdRepository {
  abstract findById(id: string): Promise<StoreModel>;
}
