import { AddCategoryModel } from '../../../presentation/dtos/category/add-category.dto';
import { IDbUpdateCategoryRepository } from '../../protocols/db/category/update-category-respository';
import { CategoryMongoRepository } from '../../../infra/db/mongodb/category/category-mongo-repository';
import { Injectable } from '@nestjs/common';
import { CategoryModel } from '../../../domain/models/category';
import { ProxySendMessage } from '../../../data/protocols/sns/send-message';

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
