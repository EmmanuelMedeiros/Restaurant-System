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
      url: 'postgresql://restaurant_system_user:3IBjMANTc5puR3xetF61RZGIPEhuDmMW@dpg-cvv6s59r0fns73a5mc00-a/restaurant_system',//process.env.DB_URL,
      autoLoadEntities: true,
      migrations: ['dist/migration/**/*.js'],
      migrationsRun: true,
      logging: true,
      synchronize: false,
      migrationsTableName: 'migrations',
      ssl: {
        rejectUnauthorized: true
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
