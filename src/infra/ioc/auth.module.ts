import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { Module } from '@nestjs/common';
import { JwtAdapter } from '../adapters/jwt-adapter';
import { Decrypter } from '@/core/domain/protocols/cryptography/decrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { BcryptAdapter } from '../adapters/bcrypt-adapter';
import { AuthController } from '@/presentation/controllers/auth/auth-controller';
import { StoreMongoRepository } from '../db/mongodb/store/store-mongo-repository';
import { IAuthStore } from '@/core/domain/protocols/auth/auth-store';
import { AuthStore } from '@/core/application/auth/auth';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthStore,
    BcryptAdapter,
    StoreMongoRepository,
    JwtAdapter,
    {
      provide: IAuthStore,
      useClass: AuthStore,
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
  exports: [HashComparer, Decrypter, Encrypter, IAuthStore],
})
export class AuthModule {}
