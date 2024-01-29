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

@Module({
  imports: [],
  providers: [
    DbAddCategory,
    DbListCategory,
    DbUpdateCategory,
    CategoryMongoRepository,
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
  ],
  controllers: [CategoryController],
  exports: [
    IDbAddCategoryRepository,
    IDbListCategoryRepository,
    IDbUpdateCategoryRepository,
  ],
})
export class CategoryModule {}
