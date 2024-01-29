import { IDbListCategoryRepository } from '../../../../data/protocols/db/list-category-respository';
import { IDbAddCategoryRepository } from '../../../../data/protocols/db/add-category-respository';
import { CategoryModel } from '../../../../domain/models/category';
import { AddCategoryModel } from '../../../../presentation/dtos/category/add-category.dto';
import { MongoHelper } from '../helpers/mongo-helper';
import { Injectable } from '@nestjs/common';
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
    const categoryCollection = await MongoHelper.getCollection('categories');
    const result = await (await categoryCollection).insertOne(payload);
    const category = await MongoHelper.findOne('categories', result.insertedId);
    return MongoHelper.map(category);
  }

  async getAll(): Promise<CategoryModel[]> {
    const categoryCollection = await MongoHelper.getCollection('categories');
    const categoriesCursor = await categoryCollection.find();
    const categoriesArray = await categoriesCursor.toArray(); // Converter para um array

    return categoriesArray.map((category) => MongoHelper.map(category));
  }

  async update(id: string, payload: AddCategoryModel): Promise<CategoryModel> {
    const categoryCollection = await MongoHelper.getCollection('categories');
    await categoryCollection.updateOne(
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

    return await MongoHelper.findOne('categories', new ObjectId(id));
  }
}
