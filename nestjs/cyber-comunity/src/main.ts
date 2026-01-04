import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/constant/app.constant';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  app.useGlobalPipes(new ValidationPipe())

  const port = PORT ?? 3069;
  await app.listen(port, () => {
    console.log(`🤷 Server online at: ${port}`);
  });
}
bootstrap();
