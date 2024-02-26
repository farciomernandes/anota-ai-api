import { StoreModel } from '@/core/domain/models/store';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';

export abstract class IDbDeleteStoreRepository {
  abstract delete(id: string, user: Authenticated): Promise<StoreModel>;
}
