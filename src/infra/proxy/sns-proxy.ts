import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk'; // Use '* as' para importar o AWS

@Injectable()
export class SnsProxy {
  private sns: AWS.SNS;

  constructor(private readonly configService: ConfigService) {
    AWS.config.update({ region: configService.get<string>('AWS_REGION') });

    this.sns = new AWS.SNS({
      apiVersion: configService.get<string>('AWS_SNS_API_VERSION'),
    });
  }

  async sendSnsMessage(message: string, topicArn: string): Promise<string> {
    try {
      const params = {
        Message: message,
        TopicArn: topicArn,
      };

      const data = await this.sns.publish(params).promise();

      console.log(`Message ${message} sent to the topic ${topicArn}`);
      console.log('MessageID is ' + data.MessageId);

      return data.MessageId;
    } catch (error) {
      console.error('Erro ao enviar a mensagem para o tópico SNS:', error);
      throw error; // Lançar o erro para tratamento em níveis superiores, se necessário
    }
  }
}
