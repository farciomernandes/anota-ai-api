import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CategoryModel } from '@/core/domain/models/category';
import { IDbDeleteCategoryRepository } from '../../domain/protocols/db/category/delete-category-respository';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';

@Injectable()
export class DbDeleteCategory implements IDbDeleteCategoryRepository {
  constructor(private readonly categoryMongoRepositoy: CategoryRepository) {}
  async delete(id: string, user: Authenticated): Promise<CategoryModel> {
    const category = await this.categoryMongoRepositoy.findById(id);

    if (category.ownerId !== user.id && user.roles.value !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    return await this.categoryMongoRepositoy.delete(id, user);
  }
}
