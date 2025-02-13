import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TableModule } from './table/table.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCategoryModule } from './item-category/item-category.module';
import { ItemModule } from './item/item.module';
import { UserModule } from './user/user.module';
import { OrderItemModule } from './order-item/order-item.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from './authorization/authorization.module';
import { JWTVerify } from './common/middleware/jwtVerify.middleware';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true
    }
  ) ,TableModule, ItemCategoryModule, ItemModule, UserModule, OrderItemModule, OrderModule, AuthorizationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTVerify).forRoutes('*');
  }
}
