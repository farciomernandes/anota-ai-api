// category.module.ts

import { Module } from '@nestjs/common';
import { DbAddCategory } from '../../data/usecases/category/db-add-category';
import { CategoryController } from '../../presentation/controllers/category/category-controller';
import { IDbAddCategoryRepository } from '../../data/protocols/db/category/add-category-respository';
import { CategoryMongoRepository } from '../db/mongodb/category/category-mongo-repository';
import { DbListCategory } from '../../data/usecases/category/db-list-category';
import { IDbListCategoryRepository } from '../../data/protocols/db/category/list-category-respository';
import { DbUpdateCategory } from '../../data/usecases/category/db-update-category';
import { IDbUpdateCategoryRepository } from '../../data/protocols/db/category/update-category-respository';
import { DbDeleteCategory } from '../../data/usecases/category/db-delete-category';
import { IDbDeleteCategoryRepository } from '../../data/protocols/db/category/delete-category-respository';
import { SnsProxy } from '../proxy/sns-proxy';
import { ProxySendMessage } from '../../data/protocols/sns/send-message';

@Module({
  imports: [],
  providers: [
    SnsProxy,
    CategoryMongoRepository,
    DbAddCategory,
    DbListCategory,
    DbUpdateCategory,
    DbDeleteCategory,
    {
      provide: ProxySendMessage,
      useClass: SnsProxy,
    },
    {
      provide: IDbAddCategoryRepository,
      useClass: DbAddCategory,
    },
    {
      provide: IDbListCategoryRepository,
      useClass: DbListCategory,
    },
    {
      provide: IDbUpdateCategoryRepository,
      useClass: DbUpdateCategory,
    },
    {
      provide: IDbDeleteCategoryRepository,
      useClass: DbDeleteCategory,
    },
  ],
  controllers: [CategoryController],
  exports: [
    IDbAddCategoryRepository,
    IDbListCategoryRepository,
    IDbUpdateCategoryRepository,
    IDbDeleteCategoryRepository,
  ],
})
export class CategoryModule {}
