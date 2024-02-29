import { Injectable } from '@nestjs/common';
import { IDbAddStoreRepository } from '@/core/domain/protocols/db/store/add-store-repository';
import { IDbFindStoreByEmailRepository } from '@/core/domain/protocols/db/store/find-store-by-email-repository';
import { IDbListStoreRepository } from '@/core/domain/protocols/db/store/list-store-respository';
import { IDbDeleteStoreRepository } from '@/core/domain/protocols/db/store/delete-store-respository';
import { IDbFindStoreByIdRepository } from '@/core/domain/protocols/db/store/find-store-by-id-repository';
import { IDbUpdateStoreRepository } from '@/core/domain/protocols/db/store/update-store-respository';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';
import { CreatedStore } from '@/presentation/dtos/store/created-store';
import { StoreModel } from '../models/store';

@Injectable()
export abstract class StoreRepository
  implements
    IDbAddStoreRepository,
    IDbFindStoreByEmailRepository,
    IDbListStoreRepository,
    IDbDeleteStoreRepository,
    IDbFindStoreByIdRepository,
    IDbUpdateStoreRepository
{
  abstract update(
    id: string,
    payload: Omit<AddStoreModel, 'ownerId'>,
  ): Promise<StoreModel>;
  abstract findById(id: string): Promise<StoreModel>;
  abstract delete(id: string): Promise<StoreModel>;
  abstract getAll(): Promise<StoreModel[]>;
  abstract findByEmail(email: string): Promise<StoreModel>;
  abstract create(payload: AddStoreModel): Promise<CreatedStore>;
}
