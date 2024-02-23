import { Module } from '@nestjs/common';
import { BcryptAdapter } from '../adapters/bcrypt-adapter';
import { IHasher } from '@/core/domain/protocols/cryptography/hasher';
import { JwtAdapter } from '../adapters/jwt-adapter';
import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { Decrypter } from '@/core/domain/protocols/cryptography/decrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { DbAddAdmin } from '@/core/application/admin/db-add-admin';
import { DbListAdmin } from '@/core/application/admin/db-list-admin';
import { AdminMongoRepository } from '../db/mongodb/admin/admin-mongo-repository';
import { IDbListAdminRepository } from '@/core/domain/protocols/db/admin/list-admin-respository';
import { IDbAddAdminRepository } from '@/core/domain/protocols/db/admin/add-admin-repository';
import { AdminController } from '@/presentation/controllers/admin/admin-controller';

@Module({
  imports: [],
  providers: [
    AdminMongoRepository,
    DbAddAdmin,
    DbListAdmin,
    BcryptAdapter,
    JwtAdapter,
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
      provide: IDbAddAdminRepository,
      useClass: DbAddAdmin,
    },
    {
      provide: IDbListAdminRepository,
      useClass: DbListAdmin,
    },
  ],
  controllers: [AdminController],
  exports: [
    IDbAddAdminRepository,
    IDbListAdminRepository,
    BcryptAdapter,
    Encrypter,
  ],
})
export class AdminModule {}
