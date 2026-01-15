import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    @Inject('EMAIL_SERVICE') private client: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    console.log({ createOrderDto });

    const result = await this.prisma.orders.create({
      data: createOrderDto,
      include: {
        Users: true,
        Foods: true,
      },
    });

    this.client.emit("createEmail", result)

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
