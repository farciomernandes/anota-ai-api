import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { Module } from '@nestjs/common';
import { JwtAdapter } from '../adapters/jwt-adapter';
import { Decrypter } from '@/core/domain/protocols/cryptography/decrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { BcryptAdapter } from '../adapters/bcrypt-adapter';
import { AuthController } from '@/presentation/controllers/auth/auth-controller';
import { StoreMongoRepository } from '../db/mongodb/store/store-mongo-repository';
import { IAuthStore } from '@/core/domain/protocols/auth/auth-store';
import { AdminMongoRepository } from '../db/mongodb/admin/admin-mongo-repository';
import { AuthStore } from '@/core/application/auth/auth-store';
import { IAuthAdmin } from '@/core/domain/protocols/auth/auth-admin';
import { AuthAdmin } from '@/core/application/auth/auth-admin';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthStore,
    BcryptAdapter,
    StoreMongoRepository,
    AdminMongoRepository,
    JwtAdapter,
    {
      provide: IAuthStore,
      useClass: AuthStore,
    },
    {
      provide: IAuthAdmin,
      useClass: AuthAdmin,
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
  ],
  exports: [HashComparer, Decrypter, Encrypter, IAuthStore, IAuthAdmin],
})
export class AuthModule {}
