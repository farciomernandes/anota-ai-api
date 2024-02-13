import { IDbAddUserRepository } from '@/data/protocols/db/user/add-user-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserModel } from '@/domain/models/user';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';
import { IDbFindUserByEmailRepository } from '@/data/protocols/db/user/find-user-by-email-repository';

@Injectable()
export class UserMongoRepository
  implements IDbAddUserRepository, IDbFindUserByEmailRepository
{
  async create(payload: AddUserModel): Promise<UserModel> {
    try {
      const userCollection = await MongoHelper.getCollection('users');

      const result = await userCollection.insertOne(payload);

      const user = await userCollection.findOne({
        _id: result.insertedId,
      });

      userCollection.deleteMany({});

      return MongoHelper.map({
        ...user,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByEmail(email: string): Promise<boolean> {
    try {
      const userCollection = await MongoHelper.getCollection('users');
      const user = await userCollection.findOne({
        email,
      });
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
