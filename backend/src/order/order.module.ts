import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { UserModule } from 'src/user/user.module';
import { TableModule } from 'src/table/table.module';
import { OrderItem } from './entity/orderItem.entity';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), UserModule, TableModule, ItemModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
