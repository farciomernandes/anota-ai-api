import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from '@/infra/ioc/category-module';
import { CategoryController } from './presentation/controllers/category/category-controller';
import { ProductModule } from '@/infra/ioc/product-module';
import { ProductController } from './presentation/controllers/product/product-controller';
import { setEnvironment } from '@/infra/config/enviroments';
import { UserModule } from './infra/ioc/user.module';
import { UserController } from './presentation/controllers/user/user-controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
    CategoryModule,
    ProductModule,
    UserModule,
  ],
  controllers: [CategoryController, ProductController, UserController],
  providers: [],
})
export class AppModule {}
