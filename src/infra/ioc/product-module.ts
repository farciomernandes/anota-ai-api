import { Module } from '@nestjs/common';
import { ProductMongoRepository } from '../db/mongodb/product/product-mongo-repository';
import { DbAddProduct } from '@/core/application/product/db-add-product';
import { DbListProduct } from '@/core/application/product/db-list-product';
import { DbUpdateProduct } from '@/core/application/product/db-update-product';
import { DbDeleteProduct } from '@/core/application/product/db-delete-product';
import { ProductController } from '@/presentation/controllers/product/product-controller';
import { IDbAddProductRepository } from '@/core/domain/protocols/db/product/add-product-respository';
import { IDbListProductRepository } from '@/core/domain/protocols/db/product/list-product-respository';
import { IDbUpdateProductRepository } from '@/core/domain/protocols/db/product/update-product-respository';
import { IDbDeleteProductRepository } from '@/core/domain/protocols/db/product/delete-product-respository';
import { CategoryMongoRepository } from '../db/mongodb/category/category-mongo-repository';
import { SnsProxy } from '../proxy/sns-proxy';
import { S3Storage } from '../proxy/s3-storage';
import { S3UploadImage } from '@/core/domain/protocols/aws/s3-upload-image';
import { ProxySendMessage } from '@/core/domain/protocols/aws/sns-send-message';
import { ProductRepository } from '@/core/domain/protocols/db/product/product-repository';

@Module({
  imports: [],
  providers: [
    S3Storage,
    SnsProxy,
    ProductMongoRepository,
    CategoryMongoRepository,
    DbAddProduct,
    DbListProduct,
    DbUpdateProduct,
    DbDeleteProduct,
    {
      provide: S3UploadImage,
      useClass: S3Storage,
    },
    {
      provide: ProxySendMessage,
      useClass: SnsProxy,
    },
    {
      provide: IDbAddProductRepository,
      useClass: DbAddProduct,
    },
    {
      provide: IDbListProductRepository,
      useClass: DbListProduct,
    },
    {
      provide: IDbUpdateProductRepository,
      useClass: DbUpdateProduct,
    },
    {
      provide: IDbDeleteProductRepository,
      useClass: DbDeleteProduct,
    },
    {
      provide: ProductRepository,
      useClass: ProductMongoRepository,
    },
  ],
  controllers: [ProductController],
  exports: [
    ProductRepository,
    IDbAddProductRepository,
    IDbListProductRepository,
    IDbUpdateProductRepository,
    IDbDeleteProductRepository,
  ],
})
export class ProductModule {}
