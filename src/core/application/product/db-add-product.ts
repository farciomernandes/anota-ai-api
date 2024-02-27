import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductModel } from '@/core/domain/models/product';
import { AddProductModel } from '@/presentation/dtos/product/add-product.dto';
import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import { S3UploadImage } from '../../domain/protocols/aws/s3-upload-image';
import { ProxySendMessage } from '../../domain/protocols/aws/sns-send-message';
import { IDbAddProductRepository } from '../../domain/protocols/db/product/add-product-respository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbAddProduct implements IDbAddProductRepository {
  constructor(
    private readonly productRepository: ProductMongoRepository,
    private readonly categoryRepository: CategoryMongoRepository,
    private readonly snsProxy: ProxySendMessage,
    private readonly s3Upload: S3UploadImage,
    private readonly configService: ConfigService,
  ) {}

  async create(
    payload: AddProductModel,
    file: Express.Multer.File,
  ): Promise<ProductModel> {
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

    const bucket = this.configService.get<string>('AWS_PRODUCT_BUCKET');
    const objectUrl = await this.s3Upload.saveFile(file, bucket);

    const created = await this.productRepository.create({
      ...payload,
      file: objectUrl,
    });

    await this.snsProxy.sendSnsMessage(created, 'product');

    return created;
  }
}
