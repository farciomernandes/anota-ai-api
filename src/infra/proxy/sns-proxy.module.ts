// SnsProxyModule
import { SnsProxy } from './sns-proxy';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [SnsProxy],
  exports: [SnsProxy],
})
export class SnsProxyModule {}
