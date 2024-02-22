import { BadRequestException, Injectable } from '@nestjs/common';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';
import { StoreModel } from '@/core/domain/models/store';
import { IDbAddStoreRepository } from '../../domain/protocols/db/store/add-store-repository';
import { IHasher } from '../../domain/protocols/cryptography/hasher';

@Injectable()
export class DbAddStore implements IDbAddStoreRepository {
  constructor(
    private readonly storeRepository: StoreMongoRepository,
    private readonly hasher: IHasher,
  ) {}

  async create(payload: AddStoreModel): Promise<StoreModel> {
    const alreadyExists = await this.storeRepository.findByEmail(payload.email);

    if (alreadyExists && alreadyExists.id) {
      throw new BadRequestException(
        `Already exists a Store with ${payload.email} email.`,
      );
    }
    const password_hash = await this.hasher.hash(payload.password);
    const storeCreated = await this.storeRepository.create({
      ...payload,
      password: password_hash,
    });

    return storeCreated;
  }
}
