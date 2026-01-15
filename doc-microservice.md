# microservice

## 1 Cài đặt rabbitmq

1. Search: `rabbitmq`
2. Click **Docs** trên header
3. Trong navbar click **Install and Upgrade**
4. Kéo xuống phần **Docker**
    - Link: https://www.rabbitmq.com/docs/download#docker
5. Click link: **RabbitMQ Docker image (on GitHub)**

### Trên Docker Hub của RabbitMQ

1. Kéo xuống phần **Setting default user and password**
    - Link: https://hub.docker.com/_/rabbitmq/#setting-default-user-and-password
2. Copy command và thêm port `5672` và `15672`:
    ```bash
    docker run -d \
      --hostname my-rabbit \
      --name some-rabbit \
      -e RABBITMQ_DEFAULT_USER=user \
      -e RABBITMQ_DEFAULT_PASS=pass \
      -p 5672:5672 \
      -p 15672:15672 \
      rabbitmq:3-management
    ```
    - 5672: là port của rabbitmq
    - 15672 (số 1 ở đầu): là port của FE
    - rabbitmq:3-management: là image có hỗ trợ FE để xem

---

## 2. Install package

tất cả source đều cài 2 lệnh này

```bash
npm i --save @nestjs/microservices
npm i --save amqplib amqp-connection-manager
```

---

## 3. Gửi và nhận

### send ↔ @MessagePattern (Đợi dữ liệu trả về)

```ts
// GỬI phải có await
const result = await lastValueFrom(
    this.client.send('createOrder', createOrderDto),
);

// NHẬN
@MessagePattern('createOrder')
getUser(@Payload() createOrderDto: CreateOrderDto) {
  return createOrderDto; // trả về cho client
}
```

### emit ↔ @EventPattern (Fire-and-Forget: Gửi đi và quên, không cần dữ liệu trả về)

```ts
// GỬI
this.client.emit('order_created', { id: 123 });

// NHẬN
@EventPattern('order_created')
handleOrderCreated(data) {
  console.log('Order event:', data);
}

```

