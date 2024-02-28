export abstract class S3UploadImage {
  abstract saveFile(
    file: Express.Multer.File,
    bucket?: string,
  ): Promise<string>;
}
