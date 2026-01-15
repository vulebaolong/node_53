# node_53

tất cả service đều cài:
npm i --save amqplib amqp-connection-manager
npm i --save @nestjs/microservices

cài rabbitmq
docker: https://hub.docker.com/_/rabbitmq/#setting-default-user-and-password

docker run -d --hostname my-rabbit --name rabbit-node53 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=12345 -p 5672:5672 -p 15672:15672 rabbitmq:3-management

send <-> MessagePattern
là gửi tin phải có await để đợi phản hồi kết quả

```ts
// Gửi
const result = await lastValueFrom(this.client.send('createOrder', data));

// NHẬN
@MessagePattern('createOrder')
```
