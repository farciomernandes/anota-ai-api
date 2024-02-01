import { Module } from '@nestjs/common';
import { ProductMongoRepository } from '../db/mongodb/product/product-mongo-repository';
import { DbAddProduct } from '../../data/usecases/product/db-add-product';
import { DbListProduct } from '../../data/usecases/product/db-list-product';
import { DbUpdateProduct } from '../../data/usecases/product/db-update-product';
import { DbDeleteProduct } from '../../data/usecases/product/db-delete-product';
import { ProductController } from '../../presentation/controllers/product/product-controller';
import { IDbAddProductRepository } from '../../data/protocols/db/product/add-product-respository';
import { IDbListProductRepository } from '../../data/protocols/db/product/list-product-respository';
import { IDbUpdateProductRepository } from '../../data/protocols/db/product/update-product-respository';
import { IDbDeleteProductRepository } from '../../data/protocols/db/product/delete-product-respository';
import { CategoryMongoRepository } from '../db/mongodb/category/category-mongo-repository';
import { SnsProxy } from '../proxy/sns-proxy';
import { ProxySendMessage } from 'src/data/protocols/sns/send-message';

@Module({
  imports: [],
  providers: [
    SnsProxy,
    ProductMongoRepository,
    CategoryMongoRepository,
    DbAddProduct,
    DbListProduct,
    DbUpdateProduct,
    DbDeleteProduct,
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
  ],
  controllers: [ProductController],
  exports: [
    IDbAddProductRepository,
    IDbListProductRepository,
    IDbUpdateProductRepository,
    IDbDeleteProductRepository,
  ],
})
export class ProductModule {}
