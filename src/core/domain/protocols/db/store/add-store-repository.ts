import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';
import { CreatedStore } from '@/presentation/dtos/store/created-store';

export abstract class IDbAddStoreRepository {
  abstract create(
    payload: Omit<AddStoreModel, 'file'>,
    file: Express.Multer.File,
  ): Promise<CreatedStore>;
}
