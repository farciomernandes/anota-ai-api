import { StoreModel } from '@/core/domain/models/store';

export abstract class IDbFindStoreByEmailRepository {
  abstract findByEmail(email: string): Promise<StoreModel>;
}
