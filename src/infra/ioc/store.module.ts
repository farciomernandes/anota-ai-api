import { Module } from '@nestjs/common';
import { BcryptAdapter } from '../adapters/bcrypt-adapter';
import { IHasher } from '@/core/domain/protocols/cryptography/hasher';
import { JwtAdapter } from '../adapters/jwt-adapter';
import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { Decrypter } from '@/core/domain/protocols/cryptography/decrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { DbAddStore } from '@/core/application/store/db-add-store';
import { DbListStore } from '@/core/application/store/db-list-store';
import { IDbAddStoreRepository } from '@/core/domain/protocols/db/store/add-store-repository';
import { IDbListStoreRepository } from '@/core/domain/protocols/db/store/list-store-respository';
import { StoreMongoRepository } from '../db/mongodb/store/store-mongo-repository';
import { StoreController } from '@/presentation/controllers/store/store-controller';
import { DbDeleteStore } from '@/core/application/store/db-delete-store';
import { IDbDeleteStoreRepository } from '@/core/domain/protocols/db/store/delete-store-respository';
import { IDbUpdateStoreRepository } from '@/core/domain/protocols/db/store/update-store-respository';
import { DbUpdateStore } from '@/core/application/store/db-update-store';
import { S3UploadImage } from '@/core/domain/protocols/aws/s3-upload-image';
import { S3Storage } from '../proxy/s3-storage';

@Module({
  imports: [],
  providers: [
    S3Storage,
    StoreMongoRepository,
    DbAddStore,
    DbListStore,
    DbDeleteStore,
    BcryptAdapter,
    JwtAdapter,
    AuthMiddleware,
    {
      provide: S3UploadImage,
      useClass: S3Storage,
    },
    {
      provide: Encrypter,
      useClass: JwtAdapter,
    },
    {
      provide: Decrypter,
      useClass: JwtAdapter,
    },
    {
      provide: HashComparer,
      useClass: BcryptAdapter,
    },
    {
      provide: IHasher,
      useClass: BcryptAdapter,
    },
    {
      provide: IDbAddStoreRepository,
      useClass: DbAddStore,
    },
    {
      provide: IDbListStoreRepository,
      useClass: DbListStore,
    },
    {
      provide: IDbDeleteStoreRepository,
      useClass: DbDeleteStore,
    },
    {
      provide: IDbUpdateStoreRepository,
      useClass: DbUpdateStore,
    },
  ],
  controllers: [StoreController],
  exports: [
    S3UploadImage,
    IDbAddStoreRepository,
    IDbListStoreRepository,
    IDbDeleteStoreRepository,
    IDbUpdateStoreRepository,
    BcryptAdapter,
    Encrypter,
  ],
})
export class StoreModule {}
