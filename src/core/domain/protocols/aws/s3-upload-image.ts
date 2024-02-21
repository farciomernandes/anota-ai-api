export abstract class S3UploadImage {
  abstract saveFile(file: Express.Multer.File): Promise<string>;
}
