import { IDbAddProductRepository } from '../../../../data/protocols/db/product/add-product-respository';
import { ProductModel } from '../../../../domain/models/product';
import { AddProductModel } from '../../../../presentation/dtos/product/add-product.dto';
import { MongoHelper } from '../helpers/mongo-helper';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { IDbListProductRepository } from '../../../../data/protocols/db/product/list-product-respository';
import { IDbUpdateProductRepository } from '../../../../data/protocols/db/product/update-product-respository';
import { IDbDeleteProductRepository } from '../../../../data/protocols/db/product/delete-product-respository';
import { UpdateProductModel } from '../../../../presentation/dtos/product/update-product.dto';

@Injectable()
export class ProductMongoRepository
  implements
    IDbAddProductRepository,
    IDbListProductRepository,
    IDbUpdateProductRepository,
    IDbDeleteProductRepository
{
  async create(payload: AddProductModel): Promise<ProductModel> {
    try {
      const productCollection = await MongoHelper.getCollection('products');
      const categoryCollection = await MongoHelper.getCollection('categories');

      const result = await productCollection.insertOne({
        ...payload,
        categoryId: new ObjectId(payload.categoryId),
      });

      const product = await productCollection.findOne({
        _id: result.insertedId,
      });

      const category = await categoryCollection.findOne({
        _id: new ObjectId(payload.categoryId),
      });

      return MongoHelper.map({
        ...product,
        category: MongoHelper.map(category),
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<ProductModel[]> {
    try {
      const productCollection = await MongoHelper.getCollection('products');
      const productsWithCategories = await productCollection
        .aggregate([
          {
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $unwind: '$category',
          },
        ])
        .toArray();

      return productsWithCategories.map((product) => MongoHelper.map(product));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByTitle(title: string): Promise<boolean> {
    try {
      const productCollection = await MongoHelper.getCollection('products');
      const product = await productCollection.findOne({
        title,
      });
      if (!product) {
        return false;
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, payload: UpdateProductModel): Promise<ProductModel> {
    try {
      const body: any = payload;
      const productCollection = await MongoHelper.getCollection('products');

      if (payload.categoryId) {
        const categoryCollection = await MongoHelper.getCollection(
          'categories',
        );
        const category = await categoryCollection.findOne({
          _id: new ObjectId(payload.categoryId),
        });

        if (!category) {
          throw new BadRequestException(
            `Category ID ${payload.categoryId} not found!`,
          );
        }

        if (payload.categoryId) {
          body.categoryId = new ObjectId(payload.categoryId);
        }
      }

      await productCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            ...payload,
          },
        },
      );

      return MongoHelper.map(
        await productCollection.findOne({
          _id: new ObjectId(id),
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<ProductModel> {
    try {
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid Product ID format.');
      }

      const productCollection = await MongoHelper.getCollection('products');

      const product = MongoHelper.map(
        await productCollection.findOne({
          _id: new ObjectId(id),
        }),
      );

      if (!product) {
        throw new BadRequestException(`Product with id ${id} not found.`);
      }

      await productCollection.deleteOne({
        _id: new ObjectId(id),
      });

      return product;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
