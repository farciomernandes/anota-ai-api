import { AddCategoryModel } from '@/presentation/dtos/category/add-category.dto';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import { Injectable } from '@nestjs/common';
import { CategoryModel } from '@/core/domain/models/category';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { IDbUpdateCategoryRepository } from '../../domain/protocols/db/category/update-category-respository';

@Injectable()
export class DbUpdateCategory implements IDbUpdateCategoryRepository {
  constructor(
    private readonly categoryMongoRepository: CategoryMongoRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}
  async update(id: string, payload: AddCategoryModel): Promise<CategoryModel> {
    const category = await this.categoryMongoRepository.update(id, payload);

    await this.snsProxy.sendSnsMessage(category, 'category');

    return category;
  }
}
