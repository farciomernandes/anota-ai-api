import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { promises as fsPromises } from 'fs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3UploadImage } from '@/core/domain/protocols/aws/s3-upload-image';

@Injectable()
export class S3Storage implements S3UploadImage {
  private client: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.client = new AWS.S3({
      region: configService.get<string>('AWS_REGION'),
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
    });
  }

  async saveFile(file: Express.Multer.File, bucket?: string): Promise<string> {
    try {
      const { filename, mimetype, path } = file;

      const fileContent = await fsPromises.readFile(path);

      await this.client
        .putObject({
          Bucket: bucket
            ? bucket
            : this.configService.get<string>('AWS_CATALOG_BUCKET'),
          Key: filename,
          ACL: 'public-read',
          Body: fileContent,
          ContentType: mimetype,
        })
        .promise();

      await fsPromises.unlink(path);

      const objectUrl = `https://${bucket}.s3.${this.client.config.region}.amazonaws.com/${filename}`;

      return objectUrl;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar o arquivo no S3');
    }
  }
}
