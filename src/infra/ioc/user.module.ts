import { Module } from '@nestjs/common';
import { IDbAddUserRepository } from '@/data/protocols/db/user/add-user-repository';
import { DbAddUser } from '@/data/usecases/user/db-add-user';
import { UserMongoRepository } from '../db/mongodb/user/user-mongo-repository';
import { BcryptAdapter } from '../adapters/bcrypt-adapter';
import { IHasher } from '@/data/protocols/cryptography/hasher';
import { UserController } from '@/presentation/controllers/user/user-controller';
import { DbListUser } from '@/data/usecases/user/db-list-user';
import { IDbListUserRepository } from '@/data/protocols/db/user/list-category-respository';
import { JwtAdapter } from '../adapters/jwt-adapter';
import { Encrypter } from '@/data/protocols/cryptography/encrypter';
import { Decrypter } from '@/data/protocols/cryptography/decrypter';
import { AuthUser } from '@/data/usecases/user/auth';
import { IAuthUser } from '@/data/protocols/auth/auth-user';
import { HashComparer } from '@/data/protocols/cryptography/hash-compare';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  imports: [],
  providers: [
    UserMongoRepository,
    DbAddUser,
    DbListUser,
    BcryptAdapter,
    JwtAdapter,
    AuthUser,
    AuthMiddleware,
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
    {
      provide: IHasher,
      useClass: BcryptAdapter,
    },
    {
      provide: IDbAddUserRepository,
      useClass: DbAddUser,
    },
    {
      provide: IDbListUserRepository,
      useClass: DbListUser,
    },
  ],
  controllers: [UserController],
  exports: [
    IDbAddUserRepository,
    IDbListUserRepository,
    BcryptAdapter,
    Encrypter,
    IAuthUser,
  ],
})
export class UserModule {}
