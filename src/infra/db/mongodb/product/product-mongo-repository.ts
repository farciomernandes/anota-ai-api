import { ProductModel } from '@/core/domain/models/product';
import { AddProductModel } from '@/presentation/dtos/product/add-product.dto';
import { MongoHelper } from '../helpers/mongo-helper';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { ProductRepository } from '@/core/domain/repositories/product-repository';

@Injectable()
export class ProductMongoRepository implements ProductRepository {
  async create(
    payload: Omit<AddProductModel, 'file'>,
    file: Express.Multer.File,
  ): Promise<ProductModel> {
    try {
      const productCollection = await MongoHelper.getCollection('products');
      const categoryCollection = await MongoHelper.getCollection('categories');

      const result = await productCollection.insertOne({
        ...payload,
        image_url: file.path,
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

  async findById(id: string): Promise<ProductModel> {
    try {
      const productCollection = await MongoHelper.getCollection('products');
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });

      return MongoHelper.map(product);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByOwnerId(id: string): Promise<ProductModel[]> {
    try {
      const productCollection = await MongoHelper.getCollection('products');
      const productsWithCategories = await productCollection
        .aggregate([
          {
            $match: {
              ownerId: id,
            },
          },
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
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
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
