import { IDbAddUserRepository } from '@/data/protocols/db/user/add-user-repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserModel } from '@/domain/models/user';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';
import { IDbFindUserByEmailRepository } from '@/data/protocols/db/user/find-user-by-email-repository';
import { IDbListUserRepository } from '@/data/protocols/db/user/list-category-respository';
import { MongoHelper } from '../helpers/mongo-helper';

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
            $match: {
              _id: { $exists: true },
            },
          },
          {
            $lookup: {
              from: 'products',
              let: { userId: { $toString: '$_id' } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$ownerId', '$$userId'],
                    },
                  },
                },
              ],
              as: 'products',
            },
          },
          {
            $lookup: {
              from: 'categories',
              let: { userId: { $toString: '$_id' } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$ownerId', '$$userId'],
                    },
                  },
                },
              ],
              as: 'categories',
            },
          },
        ])
        .toArray();

      return productsAndCategories.map((user) => {
        const mappedItem = MongoHelper.map(user);
        if (mappedItem.products) {
          mappedItem.products = mappedItem.products.map((product) =>
            MongoHelper.map(product),
          );
        }
        if (mappedItem.categories) {
          mappedItem.categories = mappedItem.categories.map((category) =>
            MongoHelper.map(category),
          );
        }
        return mappedItem;
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByEmail(email: string): Promise<UserModel> {
    try {
      const userCollection = await MongoHelper.getCollection('users');
      const user = await userCollection.findOne({
        email,
      });
      return MongoHelper.map(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
