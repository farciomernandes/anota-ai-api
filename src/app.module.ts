import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './presentation/controllers/app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController, CategoryController],
  providers: [AppService],
})
export class AppModule {}
