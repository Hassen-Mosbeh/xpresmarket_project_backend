import * as dotenv from 'dotenv';
dotenv.config();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.enableCors({
    // origin: 'http://localhost:3000', // Allow only Next.js frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true, // Allow cookies/auth if needed
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable shutdown hooks
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(8000);
}
bootstrap();
