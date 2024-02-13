import { IDbAddUserRepository } from '@/data/protocols/db/user/add-user-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserModel } from '@/domain/models/user';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';
import { IDbFindUserByEmailRepository } from '@/data/protocols/db/user/find-user-by-email-repository';
import { IDbListUserRepository } from '@/data/protocols/db/user/list-category-respository';

@Injectable()
export class UserMongoRepository
  implements
    IDbAddUserRepository,
    IDbFindUserByEmailRepository,
    IDbListUserRepository
{
  async create(payload: AddUserModel): Promise<UserModel> {
    try {
      const userCollection = await MongoHelper.getCollection('users');

      const result = await userCollection.insertOne(payload);

      const user = await userCollection.findOne({
        _id: result.insertedId,
      });

      return MongoHelper.map({
        ...user,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<UserModel[]> {
    try {
      const userCollection = await MongoHelper.getCollection('users');

      const productsAndCategories = await userCollection
        .aggregate([
          {
            $lookup: {
              from: 'products',
              localField: 'id',
              foreignField: 'ownerId',
              as: 'products',
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'id',
              foreignField: 'ownerId',
              as: 'categories',
            },
          },
        ])
        .toArray();

      return productsAndCategories.map((user) => MongoHelper.map(user));
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
