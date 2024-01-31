import { AddProductModel } from '../../../presentation/dtos/product/add-product.dto';
import { ProductModel } from '../../../domain/models/product';
import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';

export const makeFakeProduct = (): ProductModel => {
  const product = new ProductModel();
  product.id = '65b9a4cd77e2de47acb5db37';
  product.title = 'any_title';
  product.ownerId = '65b9a4cd77e2de47acb5db37';
  product.description = 'any_description';
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
