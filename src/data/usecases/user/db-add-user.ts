import { BadRequestException, Injectable } from '@nestjs/common';
import { IDbAddUserRepository } from '../../protocols/db/user/add-user-repository';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';
import { UserModel } from '@/domain/models/user';
import { IHasher } from '@/data/protocols/cryptography/hasher';

@Injectable()
export class DbAddUser implements IDbAddUserRepository {
  constructor(
    private readonly userRepository: UserMongoRepository,
    private readonly hasher: IHasher,
  ) {}

  async create(payload: AddUserModel): Promise<UserModel> {
    const alreadyExists = await this.userRepository.findByEmail(payload.email);

    if (alreadyExists) {
      throw new BadRequestException(
        `Already exists a user with ${payload.email} email.`,
      );
    }
    const password_hash = await this.hasher.hash(payload.password);
    const userCreated = await this.userRepository.create({
      ...payload,
      password: password_hash,
    });

    return userCreated;
  }
}
