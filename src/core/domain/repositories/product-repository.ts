import { IDbAddProductRepository } from '../protocols/db/product/add-product-respository';
import { IDbDeleteProductRepository } from '../protocols/db/product/delete-product-respository';
import { IDbListProductRepository } from '../protocols/db/product/list-product-respository';
import { IDbUpdateProductRepository } from '../protocols/db/product/update-product-respository';
import { IDbFindByTitleProductRepository } from '../protocols/db/product/find-by-title-product-respository';
import { ProductModel } from '@/core/domain/models/product';
import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { AddProductModel } from '@/presentation/dtos/product/add-product.dto';
import { Injectable } from '@nestjs/common';
import { IDbFindByOwnerIdProductRepository } from '../protocols/db/product/find-by-owenrId-product-respository';
import { IDbFindByIdProductRepository } from '../protocols/db/product/find-by-id-product-respository';

@Injectable()
export abstract class ProductRepository
  implements
    IDbAddProductRepository,
    IDbListProductRepository,
    IDbUpdateProductRepository,
    IDbDeleteProductRepository,
    IDbFindByTitleProductRepository,
    IDbFindByOwnerIdProductRepository,
    IDbFindByIdProductRepository
{
  abstract findById(id: string): Promise<ProductModel>;
  abstract findByOwnerId(id: string): Promise<ProductModel[]>;
  abstract findByTitle(title: string): Promise<boolean>;
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
