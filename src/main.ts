import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoHelper } from './infra/db/mongodb/helpers/mongo-helper';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config'; // Certifique-se de importar corretamente

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    await MongoHelper.connect('mongodb://localhost:27017');

    const setupSwagger = (application: INestApplication) => {
      let swaggerRoute = '/';
      if (process.env.NODE_ENV !== 'production') {
        application.use(
          ['/docs', '/docs-json'],
          basicAuth({
            challenge: true,
            users: {
              [configService.get('SWAGGER_USERNAME')]:
                configService.get('SWAGGER_PASSWORD'),
            },
          }),
        );
        swaggerRoute = '/docs';
      }

      const config = new DocumentBuilder()
        .setTitle(configService.get('APP_TITLE'))
        .setDescription(configService.get('APP_DESCRIPTION'))
        .setVersion(configService.get('APP_VERSION'))
        .build();

      const document = SwaggerModule.createDocument(application, config);
      SwaggerModule.setup(swaggerRoute, application, document);
    };

    app.useGlobalPipes(new ValidationPipe());
    setupSwagger(app);

    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`App is running on http://localhost:${port} 🚀`);
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}

bootstrap();
