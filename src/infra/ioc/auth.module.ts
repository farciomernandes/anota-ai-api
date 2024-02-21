import { AuthUser } from '@/core/application/auth/auth';
import { IAuthUser } from '@/core/domain/protocols/auth/auth-user';
import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { Module } from '@nestjs/common';
import { JwtAdapter } from '../adapters/jwt-adapter';
import { Decrypter } from '@/core/domain/protocols/cryptography/decrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { BcryptAdapter } from '../adapters/bcrypt-adapter';
import { AuthController } from '@/presentation/controllers/auth/auth-controller';
import { UserMongoRepository } from '../db/mongodb/user/user-mongo-repository';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthUser,
    BcryptAdapter,
    UserMongoRepository,
    JwtAdapter,
    {
      provide: IAuthUser,
      useClass: AuthUser,
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
  exports: [HashComparer, Decrypter, Encrypter, IAuthUser],
})
export class AuthModule {}
