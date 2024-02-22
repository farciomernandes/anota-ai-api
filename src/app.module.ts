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
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './infra/guards/roles.guard';
import { AuthMiddleware } from './infra/middleware/auth.middleware';
import { JwtAdapter } from './infra/adapters/jwt-adapter';
import { Decrypter } from './core/domain/protocols/cryptography/decrypter';
import { AuthModule } from './infra/ioc/auth.module';
import { StoreController } from './presentation/controllers/store/store-controller';
import { StoreModule } from './infra/ioc/store.module';
import { RoleModule } from './infra/ioc/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
    RoleModule,
    CategoryModule,
    ProductModule,
    StoreModule,
    AuthModule,
  ],
  controllers: [CategoryController, ProductController, StoreController],
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
      .forRoutes({ path: 'api/v1/Store', method: RequestMethod.GET });
  }
}
