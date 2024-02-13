import { ProductModel } from '@/domain/models/product';
import { makeFakeCategory } from './db-mock-helper-category';
import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';
import { AddProductModel } from '@/presentation/dtos/product/add-product.dto';

export const makeFakeProduct = (): ProductModel => {
  const product = new ProductModel();
  product.id = '65b9a4cd77e2de47acb5db37';
  product.title = 'any_title';
  product.ownerId = '65b9a4cd77e2de47acb5db37';
  product.description = 'any_description';
  product.categoryId = makeFakeCategory().id;
  product.category = makeFakeCategory();
  product.image_url =
    'https://catalog-beta-images.s3.us-east-2.amazonaws.com/image.png';
  return product;
};

export const makeProductMongoRepository = (): ProductMongoRepository => {
  class ProductRepositoryStub implements ProductMongoRepository {
    async findByTitle(title: string): Promise<boolean> {
      return false;
    }
    async delete(id: string): Promise<ProductModel> {
      return Promise.resolve(makeFakeProduct());
    }
    async update(id: string, payload: AddProductModel): Promise<ProductModel> {
      return Promise.resolve(makeFakeProduct());
    }
    async getAll(): Promise<ProductModel[]> {
      return Promise.resolve([makeFakeProduct()]);
    }
    async create(payload: AddProductModel): Promise<ProductModel> {
      return Promise.resolve(makeFakeProduct());
    }
  }

  return new ProductRepositoryStub();
};
