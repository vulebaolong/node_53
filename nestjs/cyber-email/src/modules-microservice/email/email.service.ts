import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { transporter } from 'src/common/node-mailler/init.node-mailler';

@Injectable()
export class EmailService {
  create(createEmailDto: CreateEmailDto) {
    console.log({ createEmailDto });

    transporter.sendMail({
      from: 'vulebaolong@gmail.com',
      to: 'vulebaolong@gmail.com',
      subject: 'Notification Order',
      text: `Create Order Id: ${(createEmailDto as any).id}, food: ${(createEmailDto as any).Foods.name}`, // Plain-text version of the message
      html: `<b>Create Order Id: ${(createEmailDto as any).id}, food: ${(createEmailDto as any).Foods.name}</b>`, // HTML version of the message
    });

    return 'This action adds a new email';
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
