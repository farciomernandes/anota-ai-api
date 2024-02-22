import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StoreModel } from '@/core/domain/models/store';
import { MongoHelper } from '../helpers/mongo-helper';
import { IDbAddStoreRepository } from '@/core/domain/protocols/db/store/add-store-repository';
import { IDbFindStoreByEmailRepository } from '@/core/domain/protocols/db/store/find-store-by-email-repository';
import { IDbListStoreRepository } from '@/core/domain/protocols/db/store/list-store-respository';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class StoreMongoRepository
  implements
    IDbAddStoreRepository,
    IDbFindStoreByEmailRepository,
    IDbListStoreRepository
{
  async create(payload: AddStoreModel): Promise<StoreModel> {
    try {
      const storeCollection = await MongoHelper.getCollection('stores');
      const roleCollection = await MongoHelper.getCollection('roles');

      const role = await roleCollection.findOne({
        _id: new ObjectId(payload.roleId),
      });

      if (!role) {
        throw new NotFoundException(
          `Role with ${payload.roleId} id not found!`,
        );
      }

      delete payload.roleId;
      const result = await storeCollection.insertOne({
        ...payload,
        role: MongoHelper.map(role),
      });

      const store = await storeCollection.findOne({
        _id: result.insertedId,
      });

      return MongoHelper.map({
        ...store,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<StoreModel[]> {
    try {
      const storeCollection = await MongoHelper.getCollection('stores');

      const stores = await storeCollection
        .aggregate([
          {
            $match: {
              _id: { $exists: true },
            },
          },
          {
            $lookup: {
              from: 'products',
              let: { storeId: { $toString: '$_id' } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$ownerId', '$$storeId'],
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
              let: { storeId: { $toString: '$_id' } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$ownerId', '$$storeId'],
                    },
                  },
                },
              ],
              as: 'categories',
            },
          },
        ])
        .toArray();

      return stores.map((store) => {
        const mappedItem = MongoHelper.map(store);
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

  async findByEmail(email: string): Promise<StoreModel> {
    try {
      const storeCollection = await MongoHelper.getCollection('stores');
      const store = await storeCollection.findOne({
        email,
      });

      if (!store) {
        return null;
      }

      return MongoHelper.map(store);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
