import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserModule } from 'src/user/user.module';
import { TableModule } from 'src/table/table.module';
import { ItemModule } from 'src/item/item.module';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/orderItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), UserModule, TableModule, ItemModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
