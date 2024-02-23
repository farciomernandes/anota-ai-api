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
import { AdminModule } from './infra/ioc/admin.module';
import { AdminController } from './presentation/controllers/admin/admin-controller';

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
    AdminModule,
  ],
  controllers: [
    CategoryController,
    ProductController,
    StoreController,
    AdminController,
  ],
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
  private readonly storeEndpoints = [
    { path: 'api/v1/store', method: RequestMethod.POST },
    { path: 'api/v1/store', method: RequestMethod.PUT },
    { path: 'api/v1/store', method: RequestMethod.DELETE },
  ];

  private readonly categoryEndpoints = [
    { path: 'api/v1/category', method: RequestMethod.POST },
    { path: 'api/v1/category', method: RequestMethod.PUT },
    { path: 'api/v1/category', method: RequestMethod.DELETE },
  ];

  private readonly productEndpoints = [
    { path: 'api/v1/product', method: RequestMethod.POST },
    { path: 'api/v1/product', method: RequestMethod.PUT },
    { path: 'api/v1/product', method: RequestMethod.DELETE },
  ];
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        ...this.storeEndpoints,
        ...this.categoryEndpoints,
        ...this.productEndpoints,
        { path: 'api/v1/role', method: RequestMethod.ALL },
      );
  }
}
