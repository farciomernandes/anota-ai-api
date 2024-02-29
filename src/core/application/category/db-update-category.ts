import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CategoryModel } from '@/core/domain/models/category';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { IDbUpdateCategoryRepository } from '../../domain/protocols/db/category/update-category-respository';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';

@Injectable()
export class DbUpdateCategory implements IDbUpdateCategoryRepository {
  constructor(
    private readonly categoryMongoRepository: CategoryRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}
  async update(
    id: string,
    payload: AddCategoryModel,
    user: Authenticated,
  ): Promise<CategoryModel> {
    const category = await this.categoryMongoRepository.findById(id);

    if (category.ownerId !== user.id && user.roles.value !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    const categoryUpdated = await this.categoryMongoRepository.update(
      id,
      payload,
      user,
    );

    await this.snsProxy.sendSnsMessage(categoryUpdated, 'category');

    return categoryUpdated;
  }
}
