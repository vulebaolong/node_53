import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Users } from 'src/modules-system/prisma/generated/prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(@Inject('ORDER_SERVICE') private client: ClientProxy) {}

  async create(createOrderDto: CreateOrderDto, user: Users) {
    const data = { ...createOrderDto, userId: user.id };

    console.log({ createOrderDto, user, data });

    // Gửi và đợi kết quả trả về
    // send: gửi
    // <->
    // @Messageparten(): nhận
    const result = await lastValueFrom(this.client.send('createOrder', data));

    return result;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
