import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`Server listening on port: ${port}`);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, '0.0.0.0');
  console.log(`Server listening to port: ${port}`)
}
bootstrap();
