import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './infra/ioc/category-module';
import { CategoryController } from './presentation/controllers/category/category-controller';
import { ProductModule } from './infra/ioc/product-module';
import { ProductController } from './presentation/controllers/product/product-controller';
import { SnsProxy } from './infra/proxy/sns-proxy';
import { setEnvironment } from './infra/enviroments';
import { SnsProxyModule } from './infra/proxy/sns-proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
    SnsProxyModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [CategoryController, ProductController],
  providers: [SnsProxy],
})
export class AppModule {}
