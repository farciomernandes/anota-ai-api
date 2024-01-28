import { IDbListCategoryRepository } from 'src/data/protocols/db/list-category-respository';
import { IDbAddCategoryRepository } from '../../../../data/protocols/db/add-category-respository';
import { CategoryModel } from '../../../../domain/models/category';
import { AddCategoryModel } from '../../../../presentation/dtos/category/add-category.dto';
import { MongoHelper } from '../helpers/mongo-helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryMongoRepository
  implements IDbAddCategoryRepository, IDbListCategoryRepository
{
  async create(payload: AddCategoryModel): Promise<CategoryModel> {
    const categoryCollection = await MongoHelper.getCollection('categories');
    const result = await (await categoryCollection).insertOne(payload);
    const account = await MongoHelper.findOne('categories', result.insertedId);
    return MongoHelper.map(account);
  }

  async getAll(): Promise<CategoryModel[]> {
    const categoryCollection = await MongoHelper.getCollection('categories');
    const categoriesCursor = await categoryCollection.find();
    const categoriesArray = await categoriesCursor.toArray(); // Converter para um array

    return categoriesArray.map((category) => MongoHelper.map(category));
  }
}
