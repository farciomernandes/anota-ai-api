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

@Injectable()
export class StoreMongoRepository
  implements
    IDbAddStoreRepository,
    IDbFindStoreByEmailRepository,
    IDbListStoreRepository
{
  async create(payload: AddStoreModel): Promise<StoreModel> {
    try {
      const StoreCollection = await MongoHelper.getCollection('stores');

      const result = await StoreCollection.insertOne(payload);

      const Store = await StoreCollection.findOne({
        _id: result.insertedId,
      });

      return MongoHelper.map({
        ...Store,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<StoreModel[]> {
    try {
      const StoreCollection = await MongoHelper.getCollection('stores');

      const productsAndCategories = await StoreCollection.aggregate([
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
      ]).toArray();

      return productsAndCategories.map((Store) => {
        const mappedItem = MongoHelper.map(Store);
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
      const StoreCollection = await MongoHelper.getCollection('stores');
      const Store = await StoreCollection.findOne({
        email,
      });

      if (!Store) {
        throw new NotFoundException();
      }

      return MongoHelper.map(Store);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Store with email ${email} does not exists!`,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
