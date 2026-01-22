import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RABNIT_MQ_URL } from './common/constant/app.constant';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
          urls: [RABNIT_MQ_URL!],
          queue: 'order_queue',
          queueOptions: {
            durable: false, // queue có tồn tại sau khi RabbitMQ restart hay không: false là không
          },
          socketOptions: {
            connectionOptions: {
              clientProperties: {
                connection_name: 'order-on',
              },
            },
          },
        },
    },
  );
  await app.listen();
}
bootstrap();
