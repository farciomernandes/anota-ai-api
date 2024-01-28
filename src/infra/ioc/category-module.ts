// category.module.ts

import { Module } from '@nestjs/common';
import { DbAddCategory } from '../../data/usecases/db-add-category';
import { CategoryController } from '../../presentation/controllers/category/category-controller';
import { IDbAddCategoryRepository } from '../../data/protocols/db/add-category-respository';
import { CategoryMongoRepository } from '../db/mongodb/category/category-mongo-repository';
import { DbListCategory } from 'src/data/usecases/db-list-category';
import { IDbListCategoryRepository } from 'src/data/protocols/db/list-category-respository';

@Module({
  imports: [],
  providers: [
    DbAddCategory,
    DbListCategory,
    CategoryMongoRepository,
    {
      provide: IDbAddCategoryRepository,
      useClass: DbAddCategory,
    },
    {
      provide: IDbListCategoryRepository,
      useClass: DbListCategory,
    },
  ],
  controllers: [CategoryController],
  exports: [IDbAddCategoryRepository, IDbListCategoryRepository],
})
export class CategoryModule {}
