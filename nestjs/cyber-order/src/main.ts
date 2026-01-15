import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
          urls: ['amqp://user:12345@localhost:5672'],
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
