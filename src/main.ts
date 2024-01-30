import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoHelper } from './infra/db/mongodb/helpers/mongo-helper';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  MongoHelper.connect('mongodb://localhost:27017')
    .then(async () => {
      const app = await NestFactory.create(AppModule);
      app.useGlobalPipes(new ValidationPipe());

      await app.listen(3000);
    })
    .catch((err) => console.log(err));
}
bootstrap();
