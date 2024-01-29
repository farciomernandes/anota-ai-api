import { IDbListCategoryRepository } from '../../../../data/protocols/db/list-category-respository';
import { IDbAddCategoryRepository } from '../../../../data/protocols/db/add-category-respository';
import { CategoryModel } from '../../../../domain/models/category';
import { AddCategoryModel } from '../../../../presentation/dtos/category/add-category.dto';
import { MongoHelper } from '../helpers/mongo-helper';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IDbUpdateCategoryRepository } from '../../../../data/protocols/db/update-category-respository';
import { ObjectId } from 'mongodb';

@Injectable()
export class CategoryMongoRepository
  implements
    IDbAddCategoryRepository,
    IDbListCategoryRepository,
    IDbUpdateCategoryRepository
{
  async create(payload: AddCategoryModel): Promise<CategoryModel> {
    try {
      const categoryCollection = await MongoHelper.getCollection('categories');
      const result = await (await categoryCollection).insertOne(payload);
      const category = await categoryCollection.findOne({
        _id: result.insertedId,
      });
      return MongoHelper.map(category);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(): Promise<CategoryModel[]> {
    try {
      const categoryCollection = await MongoHelper.getCollection('categories');
      const categoriesCursor = await categoryCollection.find();
      const categoriesArray = await categoriesCursor.toArray();

      return categoriesArray.map((category) => MongoHelper.map(category));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    payload: Omit<AddCategoryModel, 'ownerId'>,
  ): Promise<CategoryModel> {
    try {
      const categoryCollection = await MongoHelper.getCollection('categories');
      const categoryUpdated = await categoryCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            title: payload.title,
            description: payload.description,
          },
        },
      );
      if (categoryUpdated.matchedCount == 0) {
        throw new BadRequestException(`Category with ${id} id not found.`);
      }
      return MongoHelper.map(
        await categoryCollection.findOne({
          _id: new ObjectId(id),
        }),
      );

      return;
    } catch (error) {
      throw error;
    }
  }
}
