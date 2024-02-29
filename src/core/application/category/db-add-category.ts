import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryModel } from '@/core/domain/models/category';
import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { IDbAddCategoryRepository } from '../../domain/protocols/db/category/add-category-respository';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';

@Injectable()
export class DbAddCategory implements IDbAddCategoryRepository {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}

  async create(payload: AddCategoryModel): Promise<CategoryModel> {
    const category = await this.categoryRepository.findByTitle(payload.title);
    if (category) {
      throw new BadRequestException(
        `${MessagesHelper.ALREADY_EXITS} category with ${payload.title}!`,
      );
    }
    const categoryCreated = await this.categoryRepository.create(payload);

    await this.snsProxy.sendSnsMessage(categoryCreated, 'category');
    return categoryCreated;
  }
}
