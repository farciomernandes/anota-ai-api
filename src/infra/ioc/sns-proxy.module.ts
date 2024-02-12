import { ProxySendMessage } from '@/data/protocols/aws/sns/send-message';
import { SnsProxy } from '../proxy/sns-proxy';
import { Module } from '@nestjs/common';

@Module({
  imports: [SnsProxy],
  providers: [
    {
      provide: ProxySendMessage,
      useClass: SnsProxy,
    },
  ],
  exports: [SnsProxy],
})
export class SnsProxyModule {}
