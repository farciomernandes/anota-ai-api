import { Module } from '@nestjs/common';
import { IDbAddUserRepository } from '@/data/protocols/db/user/add-user-repository';
import { DbAddUser } from '@/data/usecases/user/db-add-user';
import { UserMongoRepository } from '../db/mongodb/user/user-mongo-repository';
import { BcryptAdapter } from '../adapters/bcrypt-adapter';
import { IHasher } from '@/data/protocols/cryptography/hasher';
import { UserController } from '@/presentation/controllers/user/user-controller';

@Module({
  imports: [],
  providers: [
    UserMongoRepository,
    DbAddUser,
    BcryptAdapter,
    {
      provide: IHasher,
      useClass: BcryptAdapter,
    },
    {
      provide: IDbAddUserRepository,
      useClass: DbAddUser,
    },
  ],
  controllers: [UserController],
  exports: [IDbAddUserRepository],
})
export class UserModule {}
