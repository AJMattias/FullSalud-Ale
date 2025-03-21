import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/envs';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/swagger/swagger-setup.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true, 
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.setGlobalPrefix('api');

  setupSwagger(app);

  const port = envConfig.PORT;

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();