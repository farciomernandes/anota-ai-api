// category.module.ts

import { Module } from '@nestjs/common';
import { DbAddCategory } from '../../data/usecases/db-add-category';
import { CategoryController } from '../../presentation/controllers/category/category-controller';
import { IDbAddCategoryRepository } from '../../data/protocols/db/add-category-respository';
import { CategoryMongoRepository } from '../db/mongodb/category/category-mongo-repository';
import { DbListCategory } from '../../data/usecases/db-list-category';
import { IDbListCategoryRepository } from '../../data/protocols/db/list-category-respository';
import { DbUpdateCategory } from '../../data/usecases/db-update-category';
import { IDbUpdateCategoryRepository } from '../../data/protocols/db/update-category-respository';
import { DbDeleteCategory } from '../../data/usecases/db-delete-category';
import { IDbDeleteCategoryRepository } from '../../data/protocols/db/delete-category-respository';

@Module({
  imports: [],
  providers: [
    CategoryMongoRepository,
    DbAddCategory,
    DbListCategory,
    DbUpdateCategory,
    DbDeleteCategory,
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
