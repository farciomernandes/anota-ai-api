import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CategoryModel } from '@/core/domain/models/category';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import { IDbDeleteCategoryRepository } from '../../domain/protocols/db/category/delete-category-respository';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';

@Injectable()
export class DbDeleteCategory implements IDbDeleteCategoryRepository {
  constructor(
    private readonly categoryMongoRepositoy: CategoryMongoRepository,
  ) {}
  async delete(id: string, user: Authenticated): Promise<CategoryModel> {
    const category = await this.categoryMongoRepositoy.findById(id);

    if (category.ownerId !== user.id && !user.roles.includes('ADMIN')) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    return await this.categoryMongoRepositoy.delete(id);
  }
}
