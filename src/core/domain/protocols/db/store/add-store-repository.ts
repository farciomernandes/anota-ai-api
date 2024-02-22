import { StoreModel } from '@/core/domain/models/store';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';

export abstract class IDbAddStoreRepository {
  abstract create(payload: AddStoreModel): Promise<StoreModel>;
}
