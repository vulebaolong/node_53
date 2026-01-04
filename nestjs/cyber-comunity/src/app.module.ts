import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules-api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules-system/prisma/prisma.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
