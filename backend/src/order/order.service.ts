import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { EntityManager, Repository } from 'typeorm';
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
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectEntityManager()
        private readonly entityManager: EntityManager
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
            const orderItem: OrderItem = new OrderItem(
                crypto.randomUUID(),
                createOrderDTO.orderItem.item,
                order,
                createOrderDTO.orderItem.quantity
            )
            await this.entityManager.transaction(async () => {
                await this.orderRepository.insert(order);
                await this.orderItemRepository.insert(orderItem)
            })
            endMessage = {data: order, status: HttpStatus.CREATED};
        }catch(err) {
            endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
        return endMessage;
    }

    async findOne(uuid: string): Promise<Order|null> {
        const user: Order|null = await this.orderRepository.findOne({
            where: {
                uuid: uuid
            },
            relations: {
                table: true,
                waiter: true
            }
        })
        return user;
    }

}
