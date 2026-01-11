import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';

@Global()
@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'https://localhost:9200',
      auth: {
        username: 'elastic',
        password: 'YZ8R9ODqu_JcO5RM6mJ8',
      },
      tls: {
        rejectUnauthorized: false,
      },
    }),
  ],
  exports: [ElasticsearchModule]
})
export class ElasticSearchModule {}
