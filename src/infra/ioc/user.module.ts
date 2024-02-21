import { Module } from '@nestjs/common';
import { IDbAddUserRepository } from '@/core/domain/protocols/db/user/add-user-repository';
import { DbAddUser } from '@/core/application/user/db-add-user';
import { UserMongoRepository } from '../db/mongodb/user/user-mongo-repository';
import { BcryptAdapter } from '../adapters/bcrypt-adapter';
import { IHasher } from '@/core/domain/protocols/cryptography/hasher';
import { UserController } from '@/presentation/controllers/user/user-controller';
import { DbListUser } from '@/core/application/user/db-list-user';
import { IDbListUserRepository } from '@/core/domain/protocols/db/user/list-category-respository';
import { JwtAdapter } from '../adapters/jwt-adapter';
import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { Decrypter } from '@/core/domain/protocols/cryptography/decrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  imports: [],
  providers: [
    UserMongoRepository,
    DbAddUser,
    DbListUser,
    BcryptAdapter,
    JwtAdapter,
    AuthMiddleware,
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
  ],
})
export class UserModule {}
