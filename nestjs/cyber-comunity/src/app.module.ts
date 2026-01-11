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
import { DATABASE_REDIS } from './common/constant/app.constant';
import { APP_GUARD } from '@nestjs/core';
import { ProtectGuard } from './common/guards/protect.guard';
import { SearchAppModule } from './modules-api/search-app/search-app.module';
import { ElasticSearchModule } from './modules-system/elastic-search/elastic-search.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    PrismaModule,
    TokenModule,
    ArticleModule,
    CacheModule.register({
      isGlobal: true,
      stores: [new KeyvRedis(DATABASE_REDIS)],
    }),
    SearchAppModule,
    ElasticSearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ProtectGuard,
    },
  ],
})
export class AppModule {}
