import { ConfigService } from '@nestjs/config';

export const makeConfigServiceMock = (): jest.Mocked<ConfigService> => {
  return {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'AWS_REGION':
          return 'mocked-region';
        case 'AWS_ACCESS_KEY_ID':
          return 'mocked-access-key-id';
        case 'AWS_SECRET_KEY':
          return 'mocked-secret-key';
        case 'AWS_SNS_API_VERSION':
          return 'mocked-api-version';
        case 'AWS_SNS_TOPIC_CATALOG_ARN':
          return 'mocked-topic-arn';
        case 'AWS_PROFILE_BUCKET':
          return 'any_profile_bucket';
        case 'AWS_CATALOG_BUCKET':
          return 'any_catalog_bucket';
        case 'AWS_BUCKET':
          return 'mocked-bucket';
      }
    }),
  } as unknown as jest.Mocked<ConfigService>;
};
