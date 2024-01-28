// category.module.ts

import { Module } from '@nestjs/common';
import { DbAddCategory } from '../../data/usecases/db-add-category';
import { CategoryController } from '../../presentation/controllers/category/category-controller';
import { IDbAddCategoryRepository } from '../../data/protocols/db/add-category-respository';
import { CategoryMongoRepository } from '../db/mongodb/category/category-mongo-repository';

@Module({
  imports: [],
  providers: [
    DbAddCategory,
    CategoryMongoRepository,
    {
      provide: IDbAddCategoryRepository,
      useClass: DbAddCategory,
    },
  ],
  controllers: [CategoryController],
  exports: [DbAddCategory],
})
export class CategoryModule {}
