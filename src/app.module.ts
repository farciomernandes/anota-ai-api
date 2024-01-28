import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './infra/ioc/category-module';
import { CategoryController } from './presentation/controllers/category/category-controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
    }),
    CategoryModule,
  ],
  controllers: [CategoryController],
  providers: [],
})
export class AppModule {}
