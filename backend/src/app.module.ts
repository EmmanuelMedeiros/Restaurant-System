import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TableModule } from './table/table.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCategoryModule } from './item-category/item-category.module';
import { ItemModule } from './item/item.module';
import { UserModule } from './user/user.module';
import { OrderItemModule } from './order-item/order-item.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'restaurant_system_db',
      synchronize: true,
      autoLoadEntities: true
    }
  ) ,TableModule, ItemCategoryModule, ItemModule, UserModule, OrderItemModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
