import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from '@/infra/ioc/category-module';
import { CategoryController } from './presentation/controllers/category/category-controller';
import { ProductModule } from '@/infra/ioc/product-module';
import { ProductController } from './presentation/controllers/product/product-controller';
import { setEnvironment } from '@/infra/config/enviroments';
import { UserModule } from './infra/ioc/user.module';
import { UserController } from './presentation/controllers/user/user-controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './infra/guards/roles.guard';
import { AuthMiddleware } from './infra/middleware/auth.middleware';
import { Decrypter } from './data/protocols/cryptography/decrypter';
import { JwtAdapter } from './infra/adapters/jwt-adapter';

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
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: Decrypter,
      useClass: JwtAdapter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'api/v1/user', method: RequestMethod.GET });
  }
}
