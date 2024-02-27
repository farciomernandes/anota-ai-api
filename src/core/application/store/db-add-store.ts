import { BadRequestException, Injectable } from '@nestjs/common';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { IDbAddStoreRepository } from '../../domain/protocols/db/store/add-store-repository';
import { IHasher } from '../../domain/protocols/cryptography/hasher';
import { CreatedStore } from '@/presentation/dtos/store/created-store';
import { S3UploadImage } from '@/core/domain/protocols/aws/s3-upload-image';
import { ConfigService } from '@nestjs/config';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';

@Injectable()
export class DbAddStore implements IDbAddStoreRepository {
  constructor(
    private readonly storeRepository: StoreMongoRepository,
    private readonly hasher: IHasher,
    private readonly s3Upload: S3UploadImage,
    private readonly configService: ConfigService,
  ) {}

  async create(
    payload: AddStoreModel,
    file?: Express.Multer.File,
  ): Promise<CreatedStore> {
    const alreadyExists = await this.storeRepository.findByEmail(payload.email);

    if (alreadyExists && alreadyExists.id) {
      throw new BadRequestException(
        `Already exists a Store with ${payload.email} email.`,
      );
    }
    const password_hash = await this.hasher.hash(payload.password);
    const bucket = this.configService.get<string>('AWS_PROFILE_BUCKET');
    const objectUrl = file ? await this.s3Upload.saveFile(file, bucket) : null;

    const storeCreated = await this.storeRepository.create({
      ...payload,
      password: password_hash,
      file: objectUrl,
    });

    return storeCreated;
  }
}
