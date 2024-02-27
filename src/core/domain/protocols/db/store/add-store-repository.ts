import { AddStoreModel } from '@/presentation/dtos/role/add-store.dto';
import { CreatedStore } from '@/presentation/dtos/store/created-store';

export abstract class IDbAddStoreRepository {
  abstract create(payload: AddStoreModel): Promise<CreatedStore>;
}
