import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { buildQueryPrisma } from 'src/common/helper/build-query-prisma.helper';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  async findAll(query) {
    const { page, pageSize, where, index } = buildQueryPrisma(query);

    // const value = await this.cacheManager.get('articles');
    // if (value) {
    //   console.log('hit cache');
    //   return value;
    // }

    // prisma
    const resultPrismaPromise = this.prisma.articles.findMany({
      where: where,
      skip: index, // skip tới vị trí index nào (OFFSET)
      take: pageSize, // take lấy bao nhiêu phần tử (LIMIT)
    });

    const totalItemPromise = this.prisma.articles.count({
      where: where,
    });

    const [resultPrisma, totalItem] = await Promise.all([
      resultPrismaPromise,
      totalItemPromise,
    ]);
    console.log('hit db');

    // sequelize
    // const resultSequelize = await Article.findAll();

    // await this.cacheManager.set('articles', resultPrisma);

    // console.dir(this.cacheManager.stores, { colors: true, depth: null });

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: Math.ceil(totalItem / pageSize),
      items: resultPrisma,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
