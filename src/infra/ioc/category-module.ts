import { Module } from '@nestjs/common';
import { DbAddCategory } from '@/core/application/category/db-add-category';
import { CategoryController } from '@/presentation/controllers/category/category-controller';
import { IDbAddCategoryRepository } from '@/core/domain/protocols/db/category/add-category-respository';
import { CategoryMongoRepository } from '../db/mongodb/category/category-mongo-repository';
import { DbListCategory } from '@/core/application/category/db-list-category';
import { IDbListCategoryRepository } from '@/core/domain/protocols/db/category/list-category-respository';
import { DbUpdateCategory } from '@/core/application/category/db-update-category';
import { IDbUpdateCategoryRepository } from '@/core/domain/protocols/db/category/update-category-respository';
import { DbDeleteCategory } from '@/core/application/category/db-delete-category';
import { IDbDeleteCategoryRepository } from '@/core/domain/protocols/db/category/delete-category-respository';
import { SnsProxy } from '../proxy/sns-proxy';
import { ProxySendMessage } from '@/core/domain/protocols/aws/sns-send-message';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';

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
      provide: CategoryRepository,
      useClass: CategoryMongoRepository,
    },
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
    CategoryRepository,
  ],
})
export class CategoryModule {}
