import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CategoryModel } from '@/core/domain/models/category';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { IDbUpdateCategoryRepository } from '../../domain/protocols/db/category/update-category-respository';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';

@Injectable()
export class DbUpdateCategory implements IDbUpdateCategoryRepository {
  constructor(
    private readonly categoryMongoRepository: CategoryMongoRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}
  async update(
    id: string,
    payload: AddCategoryModel,
    user: Authenticated,
  ): Promise<CategoryModel> {
    const category = await this.categoryMongoRepository.findById(id);

    if (category.ownerId !== user.id && !user.roles.includes('ADMIN')) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    const categoryUpdated = await this.categoryMongoRepository.update(
      id,
      payload,
    );

    await this.snsProxy.sendSnsMessage(categoryUpdated, 'category');

    return categoryUpdated;
  }
}
