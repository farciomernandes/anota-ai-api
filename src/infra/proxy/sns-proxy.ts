import { ProxySendMessage } from '@/core/domain/protocols/aws/sns-send-message';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class SnsProxy implements ProxySendMessage {
  private sns: AWS.SNS;
  private topicArn: string;

  constructor(private readonly configService: ConfigService) {
    const awsConfig = {
      region: configService.get<string>('AWS_REGION'),
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
    };
    AWS.config.update(awsConfig);

    this.sns = new AWS.SNS({
      apiVersion: configService.get<string>('AWS_SNS_API_VERSION'),
    });

    this.topicArn = this.configService.get<string>('AWS_SNS_TOPIC_CATALOG_ARN');
  }

  async sendSnsMessage(payload: any, type: string): Promise<string> {
    try {
      const params = {
        Message: JSON.stringify({ ...payload, type }),
        TopicArn: this.topicArn,
      };

      const data = await this.sns.publish(params).promise();

      return data.MessageId;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
