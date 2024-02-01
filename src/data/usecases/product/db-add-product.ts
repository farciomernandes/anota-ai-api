import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductModel } from '../../../domain/models/product';
import { AddProductModel } from '../../../presentation/dtos/product/add-product.dto';
import { IDbAddProductRepository } from '../../protocols/db/product/add-product-respository';
import { ProductMongoRepository } from '../../../infra/db/mongodb/product/product-mongo-repository';
import { CategoryMongoRepository } from '../../../infra/db/mongodb/category/category-mongo-repository';
import { ProxySendMessage } from '../../../data/protocols/sns/send-message';
@Injectable()
export class DbAddProduct implements IDbAddProductRepository {
  constructor(
    private readonly productRepository: ProductMongoRepository,
    private readonly categoryRepository: CategoryMongoRepository,
    private readonly snsProxy: ProxySendMessage,
  ) {}

  async create(payload: AddProductModel): Promise<ProductModel> {
    const product = await this.productRepository.findByTitle(payload.title);
    if (product) {
      throw new BadRequestException(
        `Already exists a product with ${payload.title} title.`,
      );
    }
    const category = await this.categoryRepository.findById(payload.categoryId);

    if (!category) {
      throw new BadRequestException(
        `Category with ${payload.categoryId} id not found.`,
      );
    }
    payload.category = category;

    const created = await this.productRepository.create(payload);

    await this.snsProxy.sendSnsMessage(created.ownerId);

    return created;
  }
}
