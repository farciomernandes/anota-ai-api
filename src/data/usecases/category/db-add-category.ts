import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryModel } from '@/domain/models/category';
import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';
import { IDbAddCategoryRepository } from '@/data/protocols/db/category/add-category-respository';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import { ProxySendMessage } from '@/data/protocols/aws/sns/send-message';

@Injectable()
export class DbAddCategory implements IDbAddCategoryRepository {
  constructor(
    private readonly categoryRepository: CategoryMongoRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}

  async create(payload: AddCategoryModel): Promise<CategoryModel> {
    const category = await this.categoryRepository.findByTitle(payload.title);
    if (category) {
      throw new BadRequestException(
        `Already exists a category with ${payload.title} title.`,
      );
    }
    const categoryCreated = await this.categoryRepository.create(payload);

    await this.snsProxy.sendSnsMessage(categoryCreated, 'category');
    return categoryCreated;
  }
}
