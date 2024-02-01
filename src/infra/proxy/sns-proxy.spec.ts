import { ConfigService } from '@nestjs/config';
import { SnsProxy } from './sns-proxy';
import { ProxySendMessage } from '../../data/protocols/sns/send-message';
import * as AWS from 'aws-sdk';
import { InternalServerErrorException } from '@nestjs/common';

interface SutTypes {
  sut: ProxySendMessage;
  configService: ConfigService;
}

const makeSut = (): SutTypes => {
  const configService = new ConfigService();

  const sut = new SnsProxy(configService);
  return {
    sut,
    configService,
  };
};

describe('SnsProxy', () => {
  it('Should handle errors when sending SNS message', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut, 'sendSnsMessage')
      .mockRejectedValueOnce(new InternalServerErrorException());

    await expect(sut.sendSnsMessage('Message')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
