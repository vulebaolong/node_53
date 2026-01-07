import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules-api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenModule } from './modules-system/token/token.module';
import { ArticleModule } from './modules-api/article/article.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    PrismaModule,
    TokenModule,
    ArticleModule,
    CacheModule.register({
      isGlobal: true,
      stores: [new KeyvRedis('redis://localhost:6381')],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
