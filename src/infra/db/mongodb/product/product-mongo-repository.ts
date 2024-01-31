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
      const result = await (await productCollection).insertOne(payload);
      const Product = await productCollection.findOne({
        _id: result.insertedId,
      });
      return MongoHelper.map(Product);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<ProductModel[]> {
    try {
      const productCollection = await MongoHelper.getCollection('products');
      const productsCursor = await productCollection.find();
      const productsArray = await productsCursor.toArray();

      return productsArray.map((Product) => MongoHelper.map(Product));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, payload: UpdateProductModel): Promise<ProductModel> {
    try {
      const productCollection = await MongoHelper.getCollection('products');
      const ProductUpdated = await productCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            title: payload.title,
            description: payload.description,
            price: payload.price,
          },
        },
      );
      if (ProductUpdated.matchedCount == 0) {
        throw new BadRequestException(`Product with ${id} id not found.`);
      }
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
      const Product = MongoHelper.map(
        await productCollection.findOne({
          _id: new ObjectId(id),
        }),
      );
      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        throw new BadRequestException(`Product with id ${id} not found.`);
      }

      return Product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
