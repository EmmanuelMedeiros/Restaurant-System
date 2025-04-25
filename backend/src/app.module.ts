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
      host: 'localhost',
      port: Number(process.env.DB_PORT),
      username: 'postgres',
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      migrations: ['dist/migration/**/*.js'],
      migrationsRun: true,
      logging: true,
      synchronize: false,
      migrationsTableName: 'migrations',
      ssl: {
        rejectUnauthorized: false
      }

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
