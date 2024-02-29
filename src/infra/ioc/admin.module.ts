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
import { DbDeleteAdmin } from '@/core/application/admin/db-delete-admin';
import { IDbDeleteAdminRepository } from '@/core/domain/protocols/db/admin/delete-admin-respository';
import { AdminRepository } from '@/core/domain/repositories/admin-repository';

@Module({
  imports: [],
  providers: [
    AdminMongoRepository,
    DbAddAdmin,
    DbListAdmin,
    DbDeleteAdmin,
    BcryptAdapter,
    JwtAdapter,
    {
      provide: AdminRepository,
      useClass: AdminMongoRepository,
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
      provide: IDbAddAdminRepository,
      useClass: DbAddAdmin,
    },
    {
      provide: IDbListAdminRepository,
      useClass: DbListAdmin,
    },
    {
      provide: IDbDeleteAdminRepository,
      useClass: DbDeleteAdmin,
    },
  ],
  controllers: [AdminController],
  exports: [
    AdminRepository,
    IDbAddAdminRepository,
    IDbListAdminRepository,
    IDbDeleteAdminRepository,
    BcryptAdapter,
    Encrypter,
  ],
})
export class AdminModule {}
