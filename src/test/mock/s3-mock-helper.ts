import { S3UploadImage } from '@/core/domain/protocols/aws/s3-upload-image';

export class S3UploadImageMock implements S3UploadImage {
  async saveFile(file: Express.Multer.File): Promise<string> {
    const fakeObjectUrl = 'https://fake-s3-url.com/fake-object';
    return Promise.resolve(fakeObjectUrl);
  }
}

export const makeS3UploadImageMock = (): S3UploadImage => {
  return new S3UploadImageMock();
};

export const makeFile = (): Express.Multer.File => {
  const file = {
    filename: 'example.txt',
    mimetype: 'text/plain',
    path: '/path/to/example.txt',
  };
  return file as Express.Multer.File;
};
