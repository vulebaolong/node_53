import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class SearchAppService implements OnModuleInit {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    // ngoài init
    // mỗi table khi create, delete, update => update lại elastic
    this.initArticle();
    this.initUser();
    this.initFood();
  }

  async searchApp(text: string) {
    const result = await this.elasticsearchService.search({
      index: ['articles', 'users', 'foods'],
      query: {
        multi_match: {
          query: text,
          fields: [
            'titile',
            'content',
            'email',
            'fulName',
            'name',
            'description',
          ],
        },
      },
    });
    return result;
  }

  async initArticle() {
    const index = 'articles';
    await this.elasticsearchService.indices.delete({
      index: index, // giống với table trong mysql,
      ignore_unavailable: true, // nếu mà index chưa có thì không báo looix
    });

    const artciles = await this.prisma.articles.findMany();

    artciles.forEach((article) => {
      this.elasticsearchService.index({
        index: index, // giống với table trong mysql
        id: String(article.id),
        document: article,
      });
    });
  }

  async initUser() {
    const index = 'users';
    await this.elasticsearchService.indices.delete({
      index: index, // giống với table trong mysql,
      ignore_unavailable: true, // nếu mà index chưa có thì không báo looix
    });

    const users = await this.prisma.users.findMany();

    users.forEach((user) => {
      this.elasticsearchService.index({
        index: index, // giống với table trong mysql
        id: String(user.id),
        document: user,
      });
    });
  }

  async initFood() {
    const index = 'foods';

    await this.elasticsearchService.indices.delete({
      index: index, // giống với table trong mysql,
      ignore_unavailable: true, // nếu mà index chưa có thì không báo looix
    });

    const foods = await this.prisma.foods.findMany();

    foods.forEach((food) => {
      this.elasticsearchService.index({
        index: index, // giống với table trong mysql
        id: String(food.id),
        document: food,
      });
    });
  }
}
