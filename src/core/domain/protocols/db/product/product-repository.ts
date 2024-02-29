import { IDbAddProductRepository } from './add-product-respository';
import { IDbDeleteProductRepository } from './delete-product-respository';
import { IDbListProductRepository } from './list-product-respository';
import { IDbUpdateProductRepository } from './update-product-respository';
import { IDbFindByTitleProductRepository } from './find-by-title-product-respository';
import { ProductModel } from '@/core/domain/models/product';
import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { AddProductModel } from '@/presentation/dtos/product/add-product.dto';

export abstract class ProductRepository
  implements
    IDbAddProductRepository,
    IDbListProductRepository,
    IDbUpdateProductRepository,
    IDbDeleteProductRepository,
    IDbFindByTitleProductRepository
{
  abstract findByTitle(title: string): Promise<boolean>;
  abstract findById(id: string): Promise<ProductModel>;
  abstract delete(id: string, user: Authenticated): Promise<ProductModel>;
  abstract update(
    id: string,
    payload: UpdateProductModel,
    user: Authenticated,
  ): Promise<ProductModel>;
  abstract getAll(): Promise<ProductModel[]>;
  abstract create(
    payload: Omit<AddProductModel, 'file'>,
    file: Express.Multer.File,
  ): Promise<ProductModel>;
}
