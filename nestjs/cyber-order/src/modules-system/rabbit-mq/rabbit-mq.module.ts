import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:12345@localhost:5672'],
          queue: 'email_queue',
          queueOptions: {
            durable: false, // queue có tồn tại sau khi RabbitMQ restart hay không: false là không
          },
          socketOptions: {
            connectionOptions: {
              clientProperties: {
                connection_name: 'email-send',
              },
            },
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule implements OnModuleInit {
  constructor(@Inject('EMAIL_SERVICE') private client: ClientProxy) {}

  onModuleInit() {
    this.client.connect();
  }
}
