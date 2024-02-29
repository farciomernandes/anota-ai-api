import { ProductModel } from '@/core/domain/models/product';
import { makeFakeCategory } from './db-mock-helper-category';
import { AddProductModel } from '@/presentation/dtos/product/add-product.dto';
import { ProductRepository } from '@/core/domain/repositories/product-repository';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { makeFakeStore } from './db-mock-helper-store';
import { RolesEnum } from '@/shared/enums/roles.enum';

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

export const makeFakeProductAuthenticatedAdmin = (): Authenticated => ({
  id: makeFakeProduct().ownerId,
  roles: makeFakeStore().role,
});

export const makeFakeProductAuthenticatedStore = (): Authenticated => ({
  id: makeFakeProduct().ownerId,
  roles: {
    ...makeFakeStore().role,
    value: RolesEnum.STORE,
  },
});

export const makeProductRepository = (): ProductRepository => {
  class ProductRepositoryStub implements ProductRepository {
    findById(id: string): Promise<ProductModel> {
      return Promise.resolve(makeFakeProduct());
    }
    async findByTitle(title: string): Promise<boolean> {
      if (makeFakeProduct().title == title) {
        return true;
      }
      return false;
    }
    async delete(id: string): Promise<ProductModel> {
      return Promise.resolve(makeFakeProduct());
    }
    async update(id: string, payload: AddProductModel): Promise<ProductModel> {
      return Promise.resolve({ ...makeFakeProduct(), ...payload });
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
