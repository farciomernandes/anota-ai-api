import * as AWS from 'aws-sdk-mock';
import { makeConfigServiceMock } from '../config/configService';
import { S3Storage } from '@/infra/proxy/s3-storage';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn().mockResolvedValue('valid_payload'),
    unlink: jest.fn(),
  },
}));

describe('SnsProxy', () => {
  const mockedFile = {
    mimetype: 'text/plain',
    filename: 'example-123456789.txt',
    path: '/caminho/para/arquivo/temporario',
  };

  afterEach(() => {
    AWS.restore();
  });

  test('Should interact with AWS SDK for S3 pubObject and call with correct values', async () => {
    const configServiceMock = makeConfigServiceMock();
    const s3Storage = new S3Storage(configServiceMock);

    const putObjectMock = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({}),
    }));

    jest
      .spyOn(s3Storage['client'], 'putObject')
      .mockImplementation(putObjectMock);

    const objectUrl = await s3Storage.saveFile(
      mockedFile as Express.Multer.File,
    );

    expect(putObjectMock).toHaveBeenCalledWith({
      Bucket: makeConfigServiceMock().get<string>('AWS_BUCKET'),
      Key: mockedFile.filename,
      ACL: 'public-read',
      Body: 'valid_payload',
      ContentType: mockedFile.mimetype,
    });

    expect(typeof objectUrl).toBe('string');
  });

  test('Should return InternalServerErrorException if saveFile throws', async () => {
    const configServiceMock = makeConfigServiceMock();
    const s3Storage = new S3Storage(configServiceMock);

    const putObjectMock = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new InternalServerErrorException()),
      );

    jest
      .spyOn(s3Storage['client'], 'putObject')
      .mockImplementation(putObjectMock);

    const promise = s3Storage.saveFile(mockedFile as Express.Multer.File);

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });
});
