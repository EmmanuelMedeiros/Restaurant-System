import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { EndMessage } from 'src/interface/EndMessage';

import * as crypto from 'crypto';
import { OrderItem } from './entity/orderItem.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>
    ) {};

    async create(createOrderDTO: CreateOrderDTO): Promise<EndMessage> {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK}
        try {
            const order: Order = new Order(
                createOrderDTO.createdAt,
                createOrderDTO.table,
                crypto.randomUUID(),
                createOrderDTO.waiter,
                undefined,
                undefined
            )
            await this.orderRepository.insert(order);
            const orderItem: OrderItem = new OrderItem(
                crypto.randomUUID(),
                createOrderDTO.orderItem.item,
                order,
                createOrderDTO.orderItem.quantity
            )
            await this.orderItemRepository.insert(orderItem)
            endMessage = {data: order, status: HttpStatus.CREATED};
        }catch(err) {
            endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
        return endMessage;
    }

}
