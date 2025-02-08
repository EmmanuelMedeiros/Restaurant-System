import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { EndMessage } from 'src/interface/EndMessage';

import * as crypto from 'crypto';
import { OrderItem } from './entity/orderItem.entity';
import { TableStatus } from 'src/enum/TableStatus';
import { Table } from 'src/table/entity/table.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        private dataSource: DataSource
    ) {};

    async create(createOrderDTO: CreateOrderDTO): Promise<EndMessage> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK}
        try {

            const updatedTable: Table = new Table(
                createOrderDTO.table.id,
                createOrderDTO.table.name,
                TableStatus.BUSY,
            )
            const order: Order = new Order(
                createOrderDTO.createdAt,
                updatedTable,
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
            await queryRunner.manager.insert(Order, order);
            await queryRunner.manager.insert(OrderItem, orderItem);
            await queryRunner.manager.update(Table, order.table.id, updatedTable)
            await queryRunner.commitTransaction();
            return endMessage = {data: order, status: HttpStatus.CREATED};
        }catch(err) {
            await queryRunner.rollbackTransaction();
            return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
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
