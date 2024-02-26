import { StoreModel } from '@/core/domain/models/store';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { AddStoreModel } from '@/presentation/dtos/role/add-role.dto';

export abstract class IDbUpdateStoreRepository {
  abstract update(
    id: string,
    payload: Omit<AddStoreModel, 'ownerId'>,
    user: Authenticated,
  ): Promise<StoreModel>;
}
