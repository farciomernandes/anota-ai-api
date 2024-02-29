import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StoreModel } from '@/core/domain/models/store';
import { MongoHelper } from '../helpers/mongo-helper';
import { ObjectId } from 'mongodb';
import { CreatedStore } from '@/presentation/dtos/store/created-store';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';
import { StoreRepository } from '@/core/domain/repositories/store-repository';

@Injectable()
export class StoreMongoRepository implements StoreRepository {
  async update(
    id: string,
    payload: Omit<AddStoreModel, 'ownerId'>,
  ): Promise<StoreModel> {
    try {
      const storeCollection = await MongoHelper.getCollection('stores');
      const storeUpdated = await storeCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            ...payload,
          },
        },
      );
      if (storeUpdated.matchedCount == 0) {
        throw new BadRequestException(`store with ${id} id not found.`);
      }
      return MongoHelper.map(
        await storeCollection.findOne({
          _id: new ObjectId(id),
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(payload: AddStoreModel): Promise<CreatedStore> {
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
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
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

  async findById(id: string): Promise<StoreModel> {
    try {
      const storeCollection = await MongoHelper.getCollection('stores');
      const store = await storeCollection.findOne({
        _id: new ObjectId(id),
      });

      return MongoHelper.map(store);
    } catch (error) {
      if (
        error.message ===
          `Cannot destructure property '_id' of 'collection' as it is null.` ||
        `Cannot destructure property '_id' of '((cov_rxnwf9ry8(...).s[24]++) , collection)' as it is null.`
      ) {
        throw new NotFoundException(
          `${MessagesHelper.NOT_FOUND} store id ${id}`,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<StoreModel> {
    try {
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException(MessagesHelper.INVALID_ID_FORMAT);
      }

      const storeCollection = await MongoHelper.getCollection('stores');

      const store = MongoHelper.map(
        await storeCollection.findOne({
          _id: new ObjectId(id),
        }),
      );

      if (!store) {
        throw new BadRequestException(`store with id ${id} not found.`);
      }

      await storeCollection.deleteOne({
        _id: new ObjectId(id),
      });

      return store;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (
        error.message ===
          `Cannot destructure property '_id' of 'collection' as it is null.` ||
        `Cannot destructure property '_id' of '((cov_rxnwf9ry8(...).s[24]++) , collection)' as it is null.`
      ) {
        throw new NotFoundException(
          `${MessagesHelper.NOT_FOUND} admin id ${id}`,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
