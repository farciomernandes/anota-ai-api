import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CategoryModel } from '@/core/domain/models/category';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import { IDbDeleteCategoryRepository } from '../../domain/protocols/db/category/delete-category-respository';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';

@Injectable()
export class DbDeleteCategory implements IDbDeleteCategoryRepository {
  constructor(
    private readonly categoryMongoRepositoy: CategoryMongoRepository,
  ) {}
  async delete(id: string, user: Authenticated): Promise<CategoryModel> {
    const category = await this.categoryMongoRepositoy.findById(id);

    if (category.ownerId !== user.id) {
      throw new UnauthorizedException(
        'You do not have authorization to perform this action.',
      );
    }
    return await this.categoryMongoRepositoy.delete(id);
  }
}
