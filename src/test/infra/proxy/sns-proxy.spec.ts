import * as AWS from 'aws-sdk-mock';
import { SnsProxy } from '@/infra/proxy/sns-proxy';
import { makeConfigServiceMock } from '../config/configService';
import { InternalServerErrorException } from '@nestjs/common';

describe('SnsProxy', () => {
  const fakePayload = {
    title: 'any_title',
    description: 'any_description',
  };
  const type = 'VALID_TYPE';

  afterEach(() => {
    AWS.restore();
  });

  test('Should interact with AWS SDK for SNS publish without calling sendSnsMessage', async () => {
    const configServiceMock = makeConfigServiceMock();
    const snsProxy = new SnsProxy(configServiceMock);

    const publishMock = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({
        MessageId: 'fakeMessageId123',
      }),
    }));

    jest.spyOn(snsProxy['sns'], 'publish').mockImplementation(publishMock);

    await snsProxy.sendSnsMessage(fakePayload, type);

    expect(publishMock).toHaveBeenCalledWith({
      Message: JSON.stringify({ ...fakePayload, type }),
      TopicArn: 'mocked-topic-arn',
    });
  });

  test('Should returns InternalServerErrorException if SNS publish throws', async () => {
    const configServiceMock = makeConfigServiceMock();
    const snsProxy = new SnsProxy(configServiceMock);

    const errorMessage = 'Error during SNS publish';

    const publishMock = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new InternalServerErrorException(errorMessage)),
      );

    jest.spyOn(snsProxy['sns'], 'publish').mockImplementation(publishMock);

    const promise = snsProxy.sendSnsMessage(fakePayload, type);

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });
});
